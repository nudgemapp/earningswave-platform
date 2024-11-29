"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/VStabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const ApiInfoSection = () => {
  const codeExamples = {
    python: `import requests

def get_ticker_data(ticker: str, date: str):
    response = requests.get(
        f"https://api.earnings.com/v1/stocks/{ticker}/earnings",
        params={"date": date},
        headers={"Authorization": "Bearer YOUR_API_KEY"}
    )
    return response.json()

# Fetch Apple's earnings data
earnings = get_ticker_data("AAPL", "2024-01-01")
print(f"Revenue: $earnings["revenue_billions"]}B")`,

    javascript: `async function getTickerData(ticker, date) {
  const response = await fetch(
    \`https://api.earnings.com/v1/stocks/\${ticker}/earnings\`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    params: { date }
  });
  
  return await response.json();
}

// Fetch Apple's earnings data
getTickerData('AAPL', '2024-01-01')
  .then(data => console.log(\`Revenue: $\${data.revenue_billions}B\`));`,

    go: `package main

import (
    "fmt"
    "net/http"
    "encoding/json"
)

func getTickerData(ticker, date string) (*EarningsData, error) {
    client := &http.Client{}
    req, _ := http.NewRequest("GET", 
        fmt.Sprintf("https://api.earnings.com/v1/stocks/%s/earnings", ticker),
        nil)
    
    req.Header.Add("Authorization", "Bearer YOUR_API_KEY")
    q := req.URL.Query()
    q.Add("date", date)
    req.URL.RawQuery = q.Encode()
    
    var data EarningsData
    // ... handle response
    return &data, nil
}`,

    java: `public class EarningsApi {
    private static final String BASE_URL = "https://api.earnings.com/v1";
    private final String apiKey;

    public EarningsResponse getTickerData(String ticker, String date) 
        throws IOException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(String.format("%s/stocks/%s/earnings", 
                BASE_URL, ticker)))
            .header("Authorization", "Bearer " + apiKey)
            .GET()
            .build();
            
        // ... handle response
        return response;
    }
}`,
  };

  return (
    <section className="bg-slate-900 py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
          {/* Left column with text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8">
              Built for Real-World Use
            </h2>

            <ul className="space-y-3 text-gray-300 text-lg mb-8">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                REST API with consistent response formats
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Flexible search across all transcript content
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Point-in-time historical data access
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Comprehensive metadata for every call
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">Perfect for:</h3>
            <ul className="space-y-2 text-gray-300 text-lg mb-8">
              <li>• Quantitative analysis platforms</li>
              <li>• Financial research tools</li>
              <li>• Earnings monitoring systems</li>
              <li>• Market intelligence dashboards</li>
            </ul>

            <p className="text-gray-300 text-lg mb-6">
              No more piecing together earnings data from multiple sources. One
              API, complete earnings intelligence.
            </p>

            <p className="text-gray-300 text-lg mb-8">
              Join the platforms already using our API to power their earnings
              analysis. Get started with a free sample api today.
            </p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button className="border-none rounded-[12px] text-lg py-3 px-6 bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-300">
                Get Sample API
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column with tabs */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full bg-slate-800 rounded-lg p-4"
          >
            <Tabs defaultValue="python" className="w-full">
              <TabsList className="w-full bg-slate-700 mb-4">
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="go">Go</TabsTrigger>
                <TabsTrigger value="java">Java</TabsTrigger>
              </TabsList>
              <TabsContent value="python">
                <SyntaxHighlighter language="python" style={vscDarkPlus}>
                  {codeExamples.python}
                </SyntaxHighlighter>
              </TabsContent>
              <TabsContent value="javascript">
                <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                  {codeExamples.javascript}
                </SyntaxHighlighter>
              </TabsContent>
              <TabsContent value="go">
                <SyntaxHighlighter language="go" style={vscDarkPlus}>
                  {codeExamples.go}
                </SyntaxHighlighter>
              </TabsContent>
              <TabsContent value="java">
                <SyntaxHighlighter language="java" style={vscDarkPlus}>
                  {codeExamples.java}
                </SyntaxHighlighter>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApiInfoSection;
