import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Ban, Sparkle, Terminal, X } from "lucide-react"
import { Button } from "./ui/button";

export default function Success({ children, cancel }) {
  if (children === null) {
    return null;
  }
  return <Alert variant="default" className="my-2 flex items-start">
    <Sparkle color="green" />
    <div className="flex-1">
      <AlertTitle className="text-green-500">Operation Success</AlertTitle>

      {children && <AlertDescription>
        {children}
      </AlertDescription>}
    </div>

    {cancel && <Button variant={'ghost'} onClick={cancel}>
      <X />
    </Button>}
  </Alert>
}