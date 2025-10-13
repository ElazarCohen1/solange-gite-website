import { Navbar, Container, Nav } from 'react-bootstrap';
import { useScrollSpy } from '../useScrollSpy'; 

function NavbarMenu() {
  const sections = ['presentation', 'about', 'decouverte','informations','contact']; 
  const active = useScrollSpy(sections, 80); 
  return (
    <Navbar 
      expand="lg"  
      bg="light" 
      variant='light'
      fixed='top'
    >
      <Container>
        {/* <Navbar.Brand href="#home" className="d-flex align-items-center gap-2">
        </Navbar.Brand> */}
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link 
              href="#presentation" 
              className={active === 'presentation' ? 'text-primary fw-bold' : 'text-dark'}
            >
              Accueil
            </Nav.Link>

            <Nav.Link 
              href="#about" 
              className={active === 'about' ? 'text-primary fw-bold' : 'text-dark'}
            >
              À propos
            </Nav.Link>

            <Nav.Link 
              href="#decouverte" 
              className={active === 'decouverte' ? 'text-primary fw-bold' : 'text-dark'}
            >
              Decouverte
            </Nav.Link>
            <Nav.Link href='#informations' className={active === 'informations'? 'text-primary fw-bold' : 'text-dark'}>
              Informations
            </Nav.Link>
            <Nav.Link 
              href="#contact" 
              className={active === 'contact' ? 'text-primary fw-bold' : 'text-dark'}
            >
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;