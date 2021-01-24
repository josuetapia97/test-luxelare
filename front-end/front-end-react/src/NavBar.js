import React,{ Component } from 'react';

class NavBar extends Component {
  render(){
    return(
      <div style={{backgroundColor:'#006400'}}>
      <nav className="navbar navbar-light" >
        <div className="container">
          <h2 className='title-navbar'>Luxelare Challenge</h2>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/"><div className='nav-text'>Mapa casos COVID México</div></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/sexo"><div className='nav-text'>Gráfica por sexo</div></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/comparacion"><div className='nav-text'>Gráfica resultado pruebas</div></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </div>
    );
  }
}


export default NavBar;
