// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeGalaxy from "starlight-theme-galaxy";

import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";
import mermaid from "astro-mermaid";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mermaid(),
    starlight({
      title: "maratib",
      favicon: "favicon.ico",
      logo: {
        src: "./src/assets/img/houston.webp",
        alt: "Maratib Ali Khan",
      },
      social: [
        {
          icon: "linkedin",
          label: "Linkedin",
          href: "https://www.linkedin.com/in/maratibali",
        },

        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/maratib",
        },
      ],
      sidebar: [
        {
          label: "Flutter",
          collapsed: true,
          autogenerate: { directory: "flutter" },
        },
        {
          label: "React",
          collapsed: true,
          autogenerate: { directory: "react" },
        },
        {
          label: "Starlight",
          collapsed: true,
          autogenerate: { directory: "starlight", collapsed: true },
        },
      ],
      plugins: [
        starlightThemeGalaxy(),
        starlightBlog({
          metrics: { readingTime: true, words: false },
          authors: {
            maratib: {
              name: "Maratib Ali",
              title: "Software Engineer",
              picture: "/headshots/maratib.png",
              url: "https://www.linkedin.com/in/maratibali",
            },
          },
        }),
        starlightLinksValidator({
          errorOnFallbackPages: false,
          errorOnInconsistentLocale: true,
          exclude: [
            "/blog/**",
            "http://localhost:8080",
            "http://localhost:8080/**",
          ],
        }),
      ],
    }),
  ],
});
