# BRAVETUX AI Image Generator

Welcome to the BRAVETUX AI Image Generator! This application allows users to generate custom images with personalized details, perfect for creating promotional materials or social media content. Users can input various details, upload their own background and profile pictures, and customize text and layout options to create unique images.

## Features

*   **Dynamic Image Generation**: Generate images based on insurance company, policy name, and user details.
*   **Custom Backgrounds**: Upload your own background image or use a dynamically generated one from Unsplash based on keywords.
*   **User Photo Integration**: Include a personal photo with customizable size and alignment.
*   **Text Customization**: Adjust font size, text alignment (left, center, right), and font color for user details.
*   **Layout Options**: Toggle to swap the positions of the user photo and text details.
*   **Form Persistence**: Your form inputs (excluding image files) are saved locally in your browser for convenience.
*   **Configuration Import/Export**: Easily save and load your form configurations as JSON files.
*   **Responsive Design**: The application is designed to work well on various screen sizes.
*   **Shadcn/ui Components**: Built with a modern and accessible UI using shadcn/ui components and Tailwind CSS.

## Tech Stack

*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **React Router**: For declarative routing in React applications.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Zod**: For schema validation.
*   **React Hook Form**: For efficient and flexible form management.
*   **Sonner**: For elegant toast notifications.
*   **Lucide React**: For beautiful and consistent icons.

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

*   Node.js (v18 or higher)
*   npm or Yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`.

## How to Use

1.  **Fill the Form**: Enter details such as Insurance Company, Policy Name, Your Name, Email ID, and Phone Number.
2.  **Upload Images**:
    *   **Background Image**: Upload a custom background image. If left empty, a random image from Unsplash will be fetched based on the insurance and policy names.
    *   **Your Photo**: Upload a profile picture.
3.  **Customize Options**:
    *   **Text Options**: Adjust font size, text alignment, and font color for the displayed user details.
    *   **Image Options (Your Photo)**: Control the size and alignment of your uploaded photo.
    *   **Layout Options**: Use the "Swap Photo and Text" toggle to change the arrangement of the photo and text sections.
4.  **Generate Image**: Click the "Generate Image" button to see your customized image appear on the right side.
5.  **Import/Export Configuration**:
    *   **Export Config**: Save your current form settings (excluding image files) to a JSON file.
    *   **Import Config**: Load previously saved settings from a JSON file to quickly apply them.

Enjoy generating your custom images!