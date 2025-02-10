import { ModelUpload } from "@/components/ModelUpload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function UploadPage() {
  return (
    <div className="container px-24 py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Upload Classification Model
          </h1>
          <p className="text-muted-foreground">
            Upload your model to the Partisia blockchain for secure
            classification.
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Model Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelUpload />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Ensure your JSON file follows this exact structure. The model
                must contain exactly 7 internal vertices and 8 leaf vertices.
              </AlertDescription>
            </Alert>

            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`{
  "internals": [
    {
      "feature": 0,
      "threshold": 100
    },
    // ... exactly 7 internal vertices
  ],
  "leaves": [
    {
      "classification": [1, 0, 0, 0, 0, 0, 0, 0]
    },
    // ... exactly 8 leaf vertices
  ]
}`}
              </code>
            </pre>

            <div className="text-sm text-muted-foreground space-y-2">
              <h3 className="font-semibold">Requirements:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Exactly 7 internal vertices with feature and threshold</li>
                <li>Exactly 8 leaf vertices with classification arrays</li>
                <li>Each classification must be an 8-bit one-hot array</li>
                <li>Features must be unsigned 8-bit integers (0-255)</li>
                <li>
                  Thresholds must be signed 16-bit integers (-32768 to 32767)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Error States Section */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Common Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Invalid number of vertices (must be exactly 7 internal, 8
                      leaf)
                    </li>
                    <li>
                      Invalid classification format (must be 8-bit one-hot
                      array)
                    </li>
                    <li>Feature or threshold values out of range</li>
                    <li>Malformed JSON structure</li>
                    <li>Network or blockchain connection issues</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
