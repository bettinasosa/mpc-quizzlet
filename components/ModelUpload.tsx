"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { uploadModel } from "@/app/actions/upload-model"

export function ModelUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true)
      setError(null)

      const file = e.target.files?.[0]
      if (!file) return

      const text = await file.text()
      const modelData = JSON.parse(text)

      // Upload model
      const result = await uploadModel(modelData)

      if (result.success) {
        toast({
          title: "Model Uploaded Successfully",
          description: (
            <div className="mt-2 text-xs font-mono break-all">
              Transaction Hash: {result.txHash}
            </div>
          )
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label
          htmlFor="model-upload"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select Model File
        </label>
        <div className="flex items-center gap-2">
          <input
            id="model-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading model to blockchain...
        </div>
      )}
    </div>
  )
}
