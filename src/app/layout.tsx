import React from "react";
import "../../public/styles/globals.css";
import AntdRegistry from "@/lib/antd/antd-registry";
import { ConfigProvider } from "antd";

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#7c3aed",
              borderRadius: 8,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
