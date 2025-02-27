"use client";

import { Config, Data } from "@measured/puck";
import { Puck } from "@measured/puck/components/Puck";
import { Render } from "@measured/puck/components/Render";
import { useEffect, useState } from "react";
import { Button } from "@measured/puck/components/Button";
import headingAnalyzer from "@measured/puck-plugin-heading-analyzer/src/HeadingAnalyzer";
import config, { initialData } from "../../config";

const isBrowser = typeof window !== "undefined";

export function Client({ path, isEdit }: { path: string; isEdit: boolean }) {
  // unique b64 key that updates each time we add / remove components
  const componentKey = Buffer.from(
    Object.keys(config.components).join("-")
  ).toString("base64");

  const key = `puck-demo:${componentKey}:${path}`;

  const [data] = useState<Data>(() => {
    if (isBrowser) {
      const dataStr = localStorage.getItem(key);

      if (dataStr) {
        return JSON.parse(dataStr);
      }

      return initialData[path] || undefined;
    }
  });

  useEffect(() => {
    if (!isEdit) {
      document.title = data?.root?.title || "";
    }
  }, [data, isEdit]);

  if (isEdit) {
    return (
      <div>
        <Puck
          config={config as Config}
          data={data}
          onPublish={async (data: Data) => {
            localStorage.setItem(key, JSON.stringify(data));
          }}
          plugins={[headingAnalyzer]}
          headerPath={path}
          renderHeaderActions={() => (
            <>
              <Button href={path} newTab variant="secondary">
                View page
              </Button>
            </>
          )}
        />
      </div>
    );
  }

  if (data) {
    return <Render config={config as Config} data={data} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>404</h1>
        <p>Page does not exist in session storage</p>
      </div>
    </div>
  );
}

export default Client;
