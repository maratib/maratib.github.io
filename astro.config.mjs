// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeGalaxy from "starlight-theme-galaxy";

import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";
import starlightImageZoom from 'starlight-image-zoom'
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
          label: "Basics",
          collapsed: true,
          autogenerate: { directory: "guides/basics" },
        },
        {
          label: "SQL",
          collapsed: true,
          autogenerate: { directory: "guides/sql" },
        },
        {
          label: "Typescript",
          collapsed: true,
          items: [
            {
              label: "Typescript with Bun",
              link: "guides/typescript/typescript-with-bun",
            },
            {
              label: "Typescript complete reference",
              link: "guides/typescript/typescript-language-reference",
            },
            {
              label: "Typescript Special Operators",
              link: "guides/typescript/typescript-special-operators",
            },
            {
              label: "Typescript All Operators",
              link: "guides/typescript/typescript-operators",
            },
            {
              label: "Types vs Interfaces",
              link: "guides/typescript/types-vs-interfaces",
            },
            {
              label: "Typescript for React",
              link: "guides/typescript/typescript-for-react",
            },
          ]
        },
         {
          label: "Python",
          collapsed: true,
           items: [
             {
              label: "Python Basics",
              link: "guides/python/python-basics",
            },
             {
              label: "Dunder Methods",
              link: "guides/python/dunder-methods",
            },
             {
              label: "Python OOP",
              link: "guides/python/python-oops",
            },
             {
              label: "Flask",
              collapsed: true,
              autogenerate: {
                directory: "guides/python/flask",
              },
            },
             {
              label: "Fast API",
              collapsed: true,
              autogenerate: {
                directory: "guides/python/fast",
              },
            },
             {
              label: "SQLAlchemy ORM",
              collapsed: true,
              autogenerate: {
                directory: "guides/python/alchemy",
              },
            },
           ]
        },
        {
          label: "Java",
          collapsed: true,
          items: [

            {
              label: "OOP Design Patterns",
              link: "guides/java/oop-design-patterns",
            },
            {
              label: "Java 8 Features",
              link: "guides/java/java-8-features",
            },
            {
              label: "Hibernate",
              collapsed: true,
              autogenerate: {
                directory: "guides/java/hibernate",
              },
            },

          ]
        },
        {
          label: "J2EE",
          collapsed: true,
          autogenerate: { directory: "guides/j2ee" },
        },
        {
          label: "APIs",
          collapsed: true,
          autogenerate: { directory: "guides/api" },
        },
        {
          label: "Spring Boot",
          collapsed: true,
          items: [
            {
              label: "Spring Boot Startup",
              link: "guides/springboot/springboot-startup",
            },
            {
              label: "Bean Scopes",
              link: "guides/springboot/bean-scope",
            },
            {
              label: "Request Lifecycle",
              link: "guides/springboot/request-life-cycle",
            },
            {
              label: "Layered Architecture ",
              link: "guides/springboot/layered-architecture",
            },
            {
              label: "JPA",
              collapsed: true,
              autogenerate: {
                directory: "guides/springboot/jpa",
              },
            },
            {
              label: "Reactor",
              collapsed: true,
              autogenerate: {
                directory: "guides/springboot/reactor",
              },
            },
          ],
        },
        {
          label: "Flutter",
          collapsed: true,
          autogenerate: { directory: "guides/flutter" },
        },
        {
          label: "React",
          collapsed: true,
          items: [
            {
              label: "React Introduction",
              link: "guides/react/react-introduction",
            },
            {
              label: "React 19 Introduction",
              link: "guides/react/react-19-introduction",
            },
            {
              label: "React Component Patterns",
              link: "guides/react/react-patterns",
            },
            {
              label: "React with Zustand",
              link: "guides/react/react-with-zustand",
            },
            {
              label: "React with TanStack Query",
              link: "guides/react/react-with-tanstack-query",
            },
            {
              label: "React Router V7",
              link: "guides/react/react-router-v7",
            },
            {
              label: "React Hooks",
              collapsed: true,
              autogenerate: {
                directory: "guides/react/hooks",
              },
            },
          ],
        },
        {
          label: "React Native",
          collapsed: true,
          items: [
            {
              label: "React Native Learning Course",
              link: "guides/reactnative/react-native-learning-course",
            },
            {
              label: "Setting up dev environment",
              link: "guides/reactnative/setup-development-environment",
            },
            {
              label: "Creating our first Expo project",
              link: "guides/reactnative/create-our-first-expo-project",
            },
            {
              label: "Creating our first Cli project",
              link: "guides/reactnative/create-our-first-cli-project",
            },
            {
              label: "React Native Introduction",
              link: "guides/reactnative/react-native-introduction",
            },
            {
              label: "ForwardRef Guide",
              link: "guides/reactnative/forward-ref",
            },
            // {
            //   label: "Stack Navigation Tutorial",
            //   link: "guides/react-native/stack-navigation-tutorial",
            // },
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
        starlightImageZoom(),
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
