import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Ban, Terminal, X } from "lucide-react"
import { Button } from "./ui/button";

export default function Error({ children }) {
  if (children === null) {
    return null;
  }
  return <Alert variant="destructive" className="my-2 flex items-start">
    <Ban />
    <div className="flex-1">
      <AlertTitle>Something Went wrong</AlertTitle>

      {children && <AlertDescription>
        {children}
      </AlertDescription>}
    </div>

    {/* <Button variant={'ghost'}>
      <X />
    </Button> */}
  </Alert>
}