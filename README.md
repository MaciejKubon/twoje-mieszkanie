# Twoje Mieszkanie

**Twoje Mieszkanie** is a comprehensive dashboard application designed for managing rental properties. It provides property owners and managers with a centralized platform to oversee objects, manage rents, and handle tenant assignments efficiently.

## Features

-   **Dashboard Overview**: Get a quick snapshot of your property portfolio.
-   **Object Management**:
    -   View detailed information about each property (apartment/house).
    -   Delete objects with confirmation.
-   **Rent Management**:
    -   Track rent payments and status.
    -   View and edit rent assignments.
    -   Navigate easily between rent details and object details.
-   **Settings**:
    -   Secure password change functionality.
-   **Authentication**:
    -   Secure login system for authorized access.

## Technology Stack

-   **Frontend**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Linting**: [ESLint](https://eslint.org/)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (Latest LTS version recommended)
-   npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd twoje-mieszkanie
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Linting

To run the linter:

```bash
npm run lint
```
