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
      customCss: ['./src/assets/css/styles.scss'],
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
          label: "Courses",
          link: "/guides/courses",
        },
        {
          label: "Flutter",
          collapsed: true,
          autogenerate: { directory: "guides/flutter" },
        },
        {
          label: "React",
          collapsed: true,
          autogenerate: { directory: "guides/react" },
        },
        {
          label: "React Native",
          collapsed: true,
          items: [
            {
              label: "React Native Learning Course",
              link: "guides/react-native/react-native-learning-course",
            },
            {
              label: "Setting up development environment",
              link: "guides/react-native/setup-development-environment",
            },
            {
              label: "Creating our first project",
              link: "guides/react-native/create-our-first-project",
            },
            {
              label: "Navigation Options",
              collapsed: true,
              autogenerate: {
                directory: "guides/react-native/navigation-options",
              },
            },
            {
              label: "Tips and Tricks",
              collapsed: true,
              autogenerate: {
                directory: "guides/react-native/tips-and-tricks",
              },
            },
          ],
        },
        {
          label: "Starlight",
          collapsed: true,
          autogenerate: { directory: "guides/starlight", collapsed: true },
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
