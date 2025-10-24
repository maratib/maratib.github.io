---
title: Spring Boot Startup
description: Spring Boot Startup
---


![SpringBoot Startup](/img/springboot/springboot-startup.svg)
## Spring Boot Startup Sequence

### **1. App Starts**
*   This is the entry point where you execute the `main` method, which calls `SpringApplication.run(YourApplication.class, args)`.
*   The JVM starts, and the Spring Boot framework takes over. This phase initializes the entire Spring application context, which is the central container that will manage all the components of your app.

### **2. Load Config**
*   Spring Boot reads and loads all configuration settings.
*   loads properties from multiple sources like `application.properties`, `application.yml`, environment variables, and command-line arguments. It also determines which active profiles (e.g., `dev`, `prod`) are set, which can change how the application behaves.

### **3. Create Context**
*   The Application Context, the heart of any Spring application, is created.
*   Think of this as the container or the "world" where all your application's objects (called "beans") will live, be managed, and connected. It's a runtime environment that provides configuration, dependency injection, and event publishing features.

### **4. Set Up Bean Factory**
*   Spring prepares the machinery it uses to create objects.
*   The Bean Factory is the core component responsible for creating and managing beans. This step sets up this factory with the basic configuration it needs to understand how to instantiate, configure, and assemble the objects defined by your code.

### **5. Process Annotations**
*   Spring scans your codebase for annotations.
*   It looks through your classes for special instructions like `@Component`, `@Service`, `@RestController`, `@Autowired`, and `@Bean`. These annotations tell Spring which classes are important and how their dependencies should be wired together. This is how it "discovers" your code.

### **6. Create All Beans**
*   Spring instantiates all the objects it discovered.
*   Based on the scan, Spring creates instances of all the required classes (beans). It also injects their dependencies (e.g., a `Service` bean gets injected into a `Controller` bean). This is the core Dependency Injection (DI) and Inversion of Control (IoC) process.

### **7. Start Web Server**
*   If your application is a web app, the embedded server starts.
*   Spring Boot automatically starts an embedded web server (like Tomcat, Jetty, or Netty) if it detects Spring Web on the classpath. It configures this server and binds it to the specified port (default: 8080), making your application ready to listen for HTTP requests.

### **8. Run StartUp Code**
*   Any custom code you want to run on startup is executed.
*   Spring looks for beans that implement interfaces like `CommandLineRunner` or `ApplicationRunner` and executes their `run` methods. This is where you can put initialization logic, like loading data into a cache or checking if a required service is available.

### **9. Ready!**
*   The startup sequence is complete.
*   The application is fully initialized. The context is refreshed, all beans are created and wired, the web server is listening, and startup tasks are done. Your application is now live and ready to perform its intended function, whether that's serving API requests, processing messages, or running batch jobs.