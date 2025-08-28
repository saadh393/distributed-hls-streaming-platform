import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db_connection } from "../../config/db-config";
import { user_table } from "../../model/user.model";

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const db = db_connection();
  const result = await db.select().from(user_table).where(eq(user_table.email, email));

  if (!result.length) {
    res.status(401).json({
      message: "Please verify your credentials",
    });
  }

  const dbUser = result[0];
  const isVerified = await argon2.verify(dbUser.password, password);

  if (!isVerified) {
    res.status(401).json({
      messsage: "Please verify your credentials",
    });
  }

  const token = jwt.sign({ id: dbUser.id, email: dbUser.email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  // @ts-ignore
  delete dbUser.password;
  res.status(201).json({ user: dbUser });
}

async function registration(req: Request, res: Response) {
  const { email, password, name } = req.body;

  try {
    const db = db_connection();
    const result = await db.select().from(user_table).where(eq(user_table.email, email));

    if (result.length) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    // User Create
    const [created] = await db.insert(user_table).values({ name, email, password: hashedPassword }).returning();

    const token = jwt.sign({ id: created.id, email: created.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    // @ts-ignore
    delete created.password;
    res.status(201).json({ user: created });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed" });
    return;
  }
}

async function me(req: Request, res: Response) {
  // @ts-ignore
  const { email } = req.user;

  const db = db_connection();
  const result = await db.select().from(user_table).where(eq(user_table.email, email));

  if (!result.length) {
    res.status(400).json({ message: "Someting went wrong" });
  }

  const userObj = result[0];
  // @ts-ignore
  delete userObj.password;

  res.status(200).json({
    user: userObj,
  });
}

async function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  res.status(200).json({ message: "Logged out successfully" });
}

const authController = { login, registration, me, logout };

export default authController;
