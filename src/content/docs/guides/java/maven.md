---
title: Maven
description: Maven
---

# **Maven Command Line Mastery for Spring Boot Developers**

## **1. Maven Fundamentals - The Command Line Perspective**

### **1.1 Understanding the Maven CLI Structure**

```
mvn [options] [goal(s)] [phase(s)]
```

**Basic Command Structure:**

```bash
mvn clean compile                 # Run phases
mvn spring-boot:run              # Execute plugin goal
mvn clean install -DskipTests    # With options
```

### **1.2 Essential Maven Commands for Daily Work**

#### **1.2.1 Project Lifecycle Commands**

```bash
# 1. Create a Spring Boot project
mvn archetype:generate \
  -DarchetypeGroupId=org.springframework.boot \
  -DarchetypeArtifactId=spring-boot-starter-parent \
  -DarchetypeVersion=3.2.0 \
  -DgroupId=com.example \
  -DartifactId=myapp \
  -Dversion=1.0.0

# 2. Compile the project
mvn compile

# 3. Run tests
mvn test

# 4. Package the application
mvn package

# 5. Install to local repository
mvn install

# 6. Clean and rebuild
mvn clean compile

# 7. Full build lifecycle
mvn clean verify

# 8. Deploy to remote repository
mvn deploy
```

#### **1.2.2 Spring Boot Specific Commands**

```bash
# Run Spring Boot application
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run with debug mode
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"

# Run with specific port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"

# Build executable JAR
mvn spring-boot:repackage

# Build Docker image
mvn spring-boot:build-image

# Generate build information
mvn spring-boot:build-info
```

### **1.3 Maven Options - What They Really Do**

```bash
# Skip tests
mvn clean install -DskipTests
mvn clean install -Dmaven.test.skip=true

# Skip integration tests
mvn clean install -DskipITs

# Run only specific tests
mvn test -Dtest=UserServiceTest
mvn test -Dtest="User*Test"  # Pattern matching
mvn test -Dtest="UserServiceTest,ProductServiceTest"  # Multiple tests

# Run specific test methods
mvn test -Dtest=UserServiceTest#testCreateUser

# Skip compilation
mvn install -Dmaven.compiler.skip=true

# Skip Javadoc generation
mvn install -Dmaven.javadoc.skip=true

# Skip source generation
mvn install -Dmaven.source.skip=true

# Offline mode (use local cache only)
mvn clean install -o

# Quiet mode (less output)
mvn clean install -q

# Debug mode (verbose output)
mvn clean install -X

# Show errors only
mvn clean install -e

# Force snapshot updates
mvn clean install -U

# Non-recursive (single module)
mvn clean install -N

# Resume from specific module
mvn clean install -rf :module-name

# Build without downloading dependencies
mvn clean install -o -nsu

# Custom Maven home
mvn clean install -Dmaven.home=/path/to/maven
```

## **2. Plugin Usage in Practice - Real World Examples**

### **2.1 The Spring Boot Maven Plugin - Hands On**

Let me show you exactly how plugins work through real examples. First, here's a **complete Spring Boot pom.xml** with plugin configurations:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>demo-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Spring Boot Plugin - The main one! -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

**Now let's use it from command line:**

```bash
# 1. Run the application
mvn spring-boot:run

# 2. Run with custom JVM arguments
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m -Xms256m"

# 3. Run with environment variables
mvn spring-boot:run -Dspring-boot.run.environmentVariables="SPRING_PROFILES_ACTIVE=dev,DB_HOST=localhost"

# 4. Run with system properties
mvn spring-boot:run -Dspring-boot.run.systemPropertyVariables="logging.level.root=DEBUG"

# 5. Package as executable JAR
mvn clean package spring-boot:repackage

# 6. Build Docker image (requires Docker daemon)
mvn spring-boot:build-image -Dspring-boot.build-image.imageName=myapp:latest

# 7. Start application in background (for integration tests)
mvn spring-boot:start
# ... run integration tests ...
mvn spring-boot:stop

# 8. Generate build info
mvn spring-boot:build-info
```

**What's happening behind the scenes?**
When you run `mvn spring-boot:run`, Maven:

1. Looks for the `spring-boot-maven-plugin` in your pom.xml
2. Finds the `run` goal of that plugin
3. Executes that goal with any parameters you provided
4. The plugin starts your Spring Boot application

### **2.2 Test Plugins - Maven Surefire & Failsafe**

Let's add test plugins and see how to use them:

```xml
<build>
    <plugins>
        <!-- Surefire for unit tests -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.1.2</version>
        </plugin>

        <!-- Failsafe for integration tests -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-failsafe-plugin</artifactId>
            <version>3.1.2</version>
        </plugin>
    </plugins>
</build>
```

**Command Line Usage:**

```bash
# 1. Run unit tests (Surefire)
mvn test

# 2. Run specific test class
mvn test -Dtest=UserServiceTest

# 3. Run tests matching pattern
mvn test -Dtest="*ServiceTest"

# 4. Run specific test method
mvn test -Dtest=UserServiceTest#testCreateUser

# 5. Skip tests
mvn install -DskipTests

# 6. Run integration tests (Failsafe)
mvn verify

# 7. Run only integration tests
mvn failsafe:integration-test

# 8. Run with test groups
mvn test -Dgroups="fast,unit"

# 9. Exclude slow tests
mvn test -DexcludedGroups="slow"

# 10. Generate test reports
mvn surefire-report:report
```

### **2.3 Dependency Plugin - Managing Dependencies**

```bash
# 1. Show dependency tree
mvn dependency:tree

# 2. Show tree for specific dependency
mvn dependency:tree -Dincludes=org.springframework:spring-core

# 3. Find dependency conflicts
mvn dependency:tree -Dverbose

# 4. Analyze dependencies for issues
mvn dependency:analyze

# 5. Copy dependencies to directory
mvn dependency:copy-dependencies

# 6. Copy with specific scope
mvn dependency:copy-dependencies -DincludeScope=runtime

# 7. List all dependencies
mvn dependency:list

# 8. Resolve specific artifact
mvn dependency:get -Dartifact=org.springframework.boot:spring-boot-starter-web:3.2.0

# 9. Purge local repository cache
mvn dependency:purge-local-repository

# 10. Build classpath file
mvn dependency:build-classpath -Dmdep.outputFile=classpath.txt
```

### **2.4 Versions Plugin - Managing Updates**

```bash
# 1. Check for dependency updates
mvn versions:display-dependency-updates

# 2. Check for plugin updates
mvn versions:display-plugin-updates

# 3. Check for property updates
mvn versions:display-property-updates

# 4. Update to latest versions
mvn versions:use-latest-versions

# 5. Update to latest releases (not snapshots)
mvn versions:use-releases

# 6. Update to next snapshot
mvn versions:use-next-snapshots

# 7. Set specific version
mvn versions:set -DnewVersion=2.0.0

# 8. Revert version change
mvn versions:revert

# 9. Commit version change
mvn versions:commit

# 10. Update parent version
mvn versions:update-parent
```

### **2.5 Jacoco Plugin - Code Coverage**

Add Jacoco to pom.xml:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Command Line Usage:**

```bash
# 1. Run tests with coverage
mvn clean test

# 2. Generate coverage report
mvn jacoco:report

# 3. Check coverage thresholds
mvn jacoco:check

# 4. Generate HTML report
mvn jacoco:report -Djacoco.outputDirectory=target/coverage

# 5. Dump execution data
mvn jacoco:dump

# 6. Merge multiple execution files
mvn jacoco:merge

# 7. Set custom coverage limits
mvn jacoco:check -Djacoco.minLineCoverage=0.8 -Djacoco.minBranchCoverage=0.7
```

## **3. Real-World Plugin Scenarios for Spring Boot**

### **3.1 Development Workflow Example**

Here's a complete development session with Maven commands:

```bash
# Start a new day - clean and update
mvn clean compile -U

# Run unit tests
mvn test

# Start application with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# In another terminal - run specific test
mvn test -Dtest=UserControllerTest

# Make changes, then rebuild
mvn clean compile

# Run integration tests
mvn verify

# Check for dependency updates
mvn versions:display-dependency-updates

# Package for deployment
mvn clean package

# Check code coverage
mvn jacoco:check

# Build Docker image
mvn spring-boot:build-image
```

### **3.2 CI/CD Pipeline Commands**

```bash
# Clean build with all checks
mvn clean verify

# With security scanning
mvn clean verify org.owasp:dependency-check-maven:check

# With code quality checks
mvn clean verify \
    spotbugs:check \
    pmd:check \
    checkstyle:check

# Build and push Docker image
mvn clean package spring-boot:build-image \
    -Dspring-boot.build-image.imageName=myregistry/myapp:$BUILD_NUMBER \
    -Dspring-boot.build-image.publish=true \
    -Dspring-boot.build-image.registryUsername=$DOCKER_USER \
    -Dspring-boot.build-image.registryPassword=$DOCKER_PASS

# Generate site documentation
mvn site

# Deploy to repository
mvn deploy -DaltDeploymentRepository=snapshots::default::https://repo.example.com/snapshots
```

### **3.3 Debugging and Troubleshooting Commands**

```bash
# 1. See what Maven is doing (debug mode)
mvn clean install -X

# 2. See effective POM (what Maven actually sees)
mvn help:effective-pom

# 3. See effective settings
mvn help:effective-settings

# 4. Check dependency resolution
mvn dependency:resolve

# 5. Display plugin help
mvn help:describe -Dplugin=org.springframework.boot:spring-boot-maven-plugin

# 6. Show plugin goals
mvn spring-boot:help

# 7. Show full dependency tree
mvn dependency:tree > tree.txt

# 8. Profile activation
mvn help:active-profiles

# 9. Check environment
mvn help:system

# 10. Dry run (simulate)
mvn clean install -DdryRun=true
```

## **4. Advanced Plugin Combinations**

### **4.1 Multi-Module Project Commands**

```bash
# 1. Build all modules
mvn clean install

# 2. Build specific module
mvn clean install -pl module-name

# 3. Build module and its dependencies
mvn clean install -pl module-name -am

# 4. Build module and dependents
mvn clean install -pl module-name -amd

# 5. Resume from failed module
mvn clean install -rf failed-module

# 6. Skip module
mvn clean install -DskipModule=module-to-skip

# 7. Parallel build
mvn clean install -T 4

# 8. Thread count per core
mvn clean install -T 1C

# 9. Build reactor
mvn clean install -r

# 10. List modules
mvn help:evaluate -Dexpression=project.modules -q -DforceStdout
```

### **4.2 Profile-Based Execution**

```xml
<!-- In pom.xml -->
<profiles>
    <profile>
        <id>dev</id>
        <properties>
            <spring.profiles.active>dev</spring.profiles.active>
        </properties>
    </profile>
    <profile>
        <id>prod</id>
        <properties>
            <spring.profiles.active>prod</spring.profiles.active>
        </properties>
    </profile>
</profiles>
```

```bash
# 1. Activate dev profile
mvn clean install -Pdev

# 2. Multiple profiles
mvn clean install -Pdev,integration

# 3. Activate by property
mvn clean install -Denvironment=dev

# 4. List all profiles
mvn help:all-profiles

# 5. Show active profiles
mvn help:active-profiles

# 6. Profile with Spring Boot
mvn spring-boot:run -Pdev -Dspring-boot.run.profiles=dev
```

### **4.3 Custom Plugin Execution**

Let's create a custom execution in pom.xml and use it:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <id>dev-run</id>
            <goals>
                <goal>run</goal>
            </goals>
            <configuration>
                <jvmArguments>
                    -Xmx512m
                    -Dspring.profiles.active=dev
                </jvmArguments>
            </configuration>
        </execution>
        <execution>
            <id>prod-build</id>
            <goals>
                <goal>repackage</goal>
            </goals>
            <configuration>
                <classifier>prod</classifier>
            </configuration>
        </execution>
    </executions>
</plugin>
```

```bash
# Run specific execution
mvn spring-boot:run@dev-run

# Skip specific execution
mvn package -DskipProdBuild

# List executions
mvn help:describe -Dplugin=spring-boot -Ddetail
```

## **5. Practical Examples & Recipes**

### **5.1 Complete Development Session Example**

**Scenario:** You're developing a Spring Boot REST API

```bash
# 1. Clone and setup
git clone https://github.com/example/spring-boot-api.git
cd spring-boot-api

# 2. First build
mvn clean compile

# 3. Run tests
mvn test

# 4. Start application with auto-reload (devtools)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 5. In another terminal - run specific test
mvn test -Dtest=UserControllerIntegrationTest

# 6. Check coverage
mvn jacoco:report
open target/site/jacoco/index.html

# 7. Check for security vulnerabilities
mvn org.owasp:dependency-check-maven:check

# 8. Update dependencies
mvn versions:display-dependency-updates

# 9. Build for production
mvn clean package -Pprod

# 10. Build Docker image
mvn spring-boot:build-image -Dspring-boot.build-image.imageName=myapi:v1.0.0
```

### **5.2 Performance Optimization Commands**

```bash
# 1. Parallel build
mvn clean install -T 4

# 2. Use daemon (mvnDaemon)
export MAVEN_OPTS="-Dmaven.ext.class.path=$HOME/.m2/extensions/maven-daemon.jar"
mvn clean install

# 3. Skip unnecessary plugins
mvn clean install -Dmaven.test.skip=true -Dmaven.javadoc.skip=true

# 4. Use local repository only
mvn clean install -o

# 5. Incremental compilation
mvn compiler:compile

# 6. Build only changed modules
mvn clean install -pl changed-module -am

# 7. Use build cache
mvn clean install -Dmaven.build.cache.enabled=true

# 8. Profile build
mvn clean install -Dmaven.perf.profile=true
```

### **5.3 Troubleshooting Common Issues**

```bash
# Issue: Dependency conflict
mvn dependency:tree -Dverbose | grep conflict
mvn dependency:analyze-duplicate

# Issue: Build failure
mvn clean install -e -X 2>&1 | tee build.log

# Issue: Plugin not found
mvn help:effective-pom | grep plugin
mvn dependency:resolve-plugins

# Issue: Memory problems
export MAVEN_OPTS="-Xmx2048m -XX:MaxPermSize=512m"
mvn clean install

# Issue: Slow downloads
# Create settings.xml with mirror
cat > ~/.m2/settings.xml << EOF
<settings>
  <mirrors>
    <mirror>
      <id>aliyun</id>
      <name>Aliyun Maven Mirror</name>
      <url>https://maven.aliyun.com/repository/public</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
  </mirrors>
</settings>
EOF

# Issue: Tests failing intermittently
mvn test -Dtest=FlakyTest -DfailIfNoTests=false
mvn surefire:test -DreuseForks=false

# Issue: Can't find main class
mvn spring-boot:run -Dspring-boot.run.main-class=com.example.Application
```

## **6. Essential Cheat Sheet**

### **6.1 Daily Commands**

```bash
# Build
mvn clean compile
mvn clean test
mvn clean package
mvn clean install

# Spring Boot
mvn spring-boot:run
mvn spring-boot:build-image

# Testing
mvn test
mvn test -Dtest=SpecificTest
mvn verify

# Dependency
mvn dependency:tree
mvn dependency:analyze

# Help
mvn help:effective-pom
mvn -v
```

### **6.2 Plugin Goal Reference**

```
spring-boot:run           # Run application
spring-boot:build-image   # Build Docker image
spring-boot:repackage     # Create executable jar

surefire:test            # Run unit tests
failsafe:integration-test # Run integration tests

dependency:tree          # Show dependency tree
dependency:analyze       # Analyze dependencies

versions:display-dependency-updates # Check updates

jacoco:report           # Generate coverage report

clean:clean             # Clean target directory
compiler:compile        # Compile source code

install:install         # Install to local repo
deploy:deploy          # Deploy to remote repo
```

### **6.3 Common Options**

```
-DskipTests             # Skip tests
-DskipITs               # Skip integration tests
-Pprofile-name          # Activate profile
-pl module              # Build specific module
-am                     # Also build dependencies
-T 4                    # Parallel build with 4 threads
-X                      # Debug output
-e                      # Error output
-o                      # Offline mode
-U                      # Update snapshots
```

## **7. Pro Tips & Best Practices**

### **7.1 Shell Aliases for Productivity**

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# Maven aliases
alias mci='mvn clean install'
alias mcit='mvn clean install -DskipTests'
alias mcp='mvn clean package'
alias mct='mvn clean test'
alias mbr='mvn spring-boot:run'
alias mbi='mvn spring-boot:build-image'
alias mdt='mvn dependency:tree'
alias mdup='mvn versions:display-dependency-updates'
alias mdebug='mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"'

# Run with dev profile
alias mbrd='mvn spring-boot:run -Dspring-boot.run.profiles=dev'

# Git + Maven
alias gmci='git pull && mvn clean install'
```

### **7.2 Maven Wrapper Usage**

```bash
# Initialize wrapper
mvn wrapper:wrapper

# Use wrapper (no need for global Maven install)
./mvnw clean install
./mvnw spring-boot:run

# Update wrapper
./mvnw wrapper:wrapper -Dmaven=3.9.5
```

### **7.3 Environment-Specific Commands**

```bash
# Development
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Testing
mvn verify -Pintegration-test

# Staging
mvn clean package -Pstaging -DskipTests

# Production
mvn clean package -Pprod
mvn spring-boot:build-image -Dspring-boot.build-image.imageName=prod/myapp:latest
```

### **7.4 One-Liners for Common Tasks**

```bash
# Quick restart
mvn clean compile spring-boot:run

# Run single test with coverage
mvn clean test -Dtest=UserServiceTest jacoco:report

# Check for updates and security
mvn versions:display-dependency-updates org.owasp:dependency-check-maven:check

# Build and push Docker
mvn clean package spring-boot:build-image -Dspring-boot.build-image.publish=true

# Full CI pipeline
mvn clean verify spotbugs:check pmd:check checkstyle:check jacoco:check
```

## **The Maven Philosophy for Spring Boot Developers**

Remember these key principles:

1. **Maven is declarative** - You declare **what** you want in pom.xml, Maven figures out **how**
2. **Plugins do the work** - Every task is executed by a plugin goal
3. **Lifecycle drives execution** - Phases trigger goals in sequence
4. **Convention over configuration** - Defaults work well for Spring Boot

**When you run `mvn spring-boot:run`:**

- Maven finds the `spring-boot-maven-plugin`
- Executes its `run` goal
- The plugin starts your Spring Boot app with embedded server
- You get live reload with spring-boot-devtools

**When you run `mvn clean install`:**

1. `clean:clean` - Deletes target directory
2. `resources:resources` - Copies resources
3. `compiler:compile` - Compiles Java code
4. `resources:testResources` - Copies test resources
5. `compiler:testCompile` - Compiles test code
6. `surefire:test` - Runs unit tests
7. `jar:jar` - Creates JAR file
8. `spring-boot:repackage` - Makes it executable (if configured)
9. `install:install` - Installs to local repository
