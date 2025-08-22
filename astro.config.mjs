// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";

const site = "http://localhost:4322";
// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    starlight({
      title: "maratib",
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
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      plugins: [
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
      customCss: [
        "./src/assets/global.css",
        // ,"./src/assets/landing.css"
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
