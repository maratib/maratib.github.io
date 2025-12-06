// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeGalaxy from "starlight-theme-galaxy";

import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";
import starlightImageZoom from "starlight-image-zoom";
import mermaid from "astro-mermaid";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mermaid(),
    starlight({
      title: "maratib",
      favicon: "favicon.ico",
      customCss: ["./src/assets/css/styles.scss"],
      head: [
        {
          tag: "script",
          attrs: {
            src: "/scripts/mermaid-fullscreen.js",
            defer: true,
          },
        },
      ],
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
          label: "Angular",
          collapsed: true,
          autogenerate: { directory: "guides/angular" },
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
          ],
        },
        {
          label: "Blockchain",
          collapsed: true,
          items: [
            {
              label: "Hardhat Setup",
              link: "guides/blockchain/hardhat-setup",
            },
            {
              label: "DeFi",
              collapsed: true,
              autogenerate: { directory: "guides/blockchain/defi" },
            },
          ],
        },
        {
          label: "NodeJS",
          collapsed: true,
          items: [
            {
              label: "Express",
              collapsed: true,
              autogenerate: { directory: "guides/node/express" },
            },
            {
              label: "MongoDB",
              collapsed: true,
              autogenerate: { directory: "guides/node/mongodb" },
            },
            {
              label: "NestJS",
              collapsed: true,
              autogenerate: { directory: "guides/node/nestjs" },
            },
          ],
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
              label: "Django",
              collapsed: true,
              autogenerate: {
                directory: "guides/python/django",
              },
            },
            {
              label: "SQLAlchemy ORM",
              collapsed: true,
              autogenerate: {
                directory: "guides/python/alchemy",
              },
            },
          ],
        },
        {
          label: "Kotlin",
          collapsed: true,
          autogenerate: { directory: "guides/kotlin" },
        },
        {
          label: "Macos",
          collapsed: true,
          autogenerate: { directory: "guides/macos" },
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
              label: "JCF",
              link: "guides/java/jcf",
            },
            {
              label: "Java 8 Features",
              link: "guides/java/java-8-features",
            },
            {
              label: "Method Reference",
              link: "guides/java/method",
            },
            {
              label: "Internals",
              collapsed: true,
              autogenerate: {
                directory: "guides/java/internals",
              },
            },
            {
              label: "Hibernate",
              collapsed: true,
              autogenerate: {
                directory: "guides/java/hibernate",
              },
            },
            {
              label: "Spring Boot",
              collapsed: true,
              items: [
                {
                  label: "Spring Boot Startup",
                  link: "guides/java/springboot/springboot-startup",
                },
                {
                  label: "Bean Scopes",
                  link: "guides/java/springboot/bean-scope",
                },
                {
                  label: "Request Lifecycle",
                  link: "guides/java/springboot/request-life-cycle",
                },
                {
                  label: "Layered Architecture",
                  link: "guides/java/springboot/layered-architecture",
                },
                {
                  label: "Exceptions",
                  link: "guides/java/springboot/exceptions",
                },
                {
                  label: "JWT",
                  link: "guides/java/springboot/jwt",
                },
                {
                  label: "Lombok",
                  link: "guides/java/springboot/project-lombok",
                },
                {
                  label: "Testing",
                  link: "guides/java/springboot/testing",
                },
                {
                  label: "Swagger",
                  link: "guides/java/springboot/swagger",
                },
                {
                  label: "Actuator",
                  link: "guides/java/springboot/actuator",
                },
                {
                  label: "RestAssured",
                  link: "guides/java/springboot/rest-assured",
                },
                {
                  label: "YAML",
                  link: "guides/java/springboot/yaml",
                },
                {
                  label: "JPA",
                  collapsed: true,
                  autogenerate: {
                    directory: "guides/java/springboot/jpa",
                  },
                },
                {
                  label: "Reactor",
                  collapsed: true,
                  autogenerate: {
                    directory: "guides/java/springboot/reactor",
                  },
                },
              ],
            },
            {
              label: "Spring Cloud",
              collapsed: true,
              items: [
                {
                  label: "Gateway",
                  link: "guides/java/springcloud/gateway",
                },
                {
                  label: "Observability",
                  link: "guides/java/springcloud/observability",
                },
                {
                  label: "ELK Stack",
                  link: "guides/java/springcloud/elk",
                },
                {
                  label: "Tracing",
                  link: "guides/java/springcloud/tracing",
                },
                {
                  label: "Exceptions",
                  link: "guides/java/springcloud/exceptions",
                },
              ],
            },
            {
              label: "J2EE",
              collapsed: true,
              autogenerate: { directory: "guides/java/j2ee" },
            },
          ],
        },

        {
          label: "APIs",
          collapsed: true,
          autogenerate: { directory: "guides/api" },
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
