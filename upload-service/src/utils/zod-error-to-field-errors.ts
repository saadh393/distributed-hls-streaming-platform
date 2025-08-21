export function zodErrorToFieldErrors(zodError: any) {
  const details = [];
  const fieldErrors: any = {};

  for (const issue of zodError.issues) {
    const path = issue.path?.length ? issue.path.join(".") : "_form";
    const message = issue.message || "Invalid value";
    details.push({ path, message });

    // প্রতি ফিল্ডে প্রথম মেসেজটাই প্রাইমারি ধরি
    if (!fieldErrors[path]) {
      fieldErrors[path] = message;
    }
  }

  return { fieldErrors, details };
}
