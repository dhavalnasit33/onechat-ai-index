export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout has zero styling, no headers, and no footers.
  // It ensures the bot ONLY sees a white background and the chart.
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: 'white' }}>
        {children}
      </body>
    </html>
  );
}