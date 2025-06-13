"use client";

import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, App } from "antd";
import { useServerInsertedHTML } from "next/navigation";

const theme = {
  token: {
    colorPrimary: "#3b82f6",
    borderRadius: 6,
  },
  components: {
    Button: {
      colorPrimary: "#3b82f6",
      algorithm: true,
    },
    Input: {
      colorPrimary: "#3b82f6",
    },
  },
};

export default function AntdRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider theme={theme}>
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
}
