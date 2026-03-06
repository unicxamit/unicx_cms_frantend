import Header from "../../shared/layout/Header";
import Footer from "../../shared/layout/Footer";
import Container from "../../shared/ui/Container";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] py-10">
        <Container>{children}</Container>
      </main>
      <Footer />
    </>
  );
}
