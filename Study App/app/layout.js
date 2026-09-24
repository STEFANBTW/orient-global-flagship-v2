import './globals.css';

export const metadata = {
  title: 'Offline PDF Quiz Generator',
  description: 'Generate MCQs and Theory questions from PDFs entirely offline using WebLLM.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
