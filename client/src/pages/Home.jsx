import { Link } from "react-router-dom";
import logo from "../assets/cms.png";
import admin from "../assets/admin.png";
import registration from "../assets/registration.png";
import user from "../assets/userlogin2.png";

function Home() {
  return (
    <>

      {/* Header started  */}

      <div className="container text-center mt-3">

        <img
          src={logo}
          className="logo"
          alt=""
        />

        <h1 className="university-name">
          Lalit Narayan Mithila University Darbhanga Bihar
        </h1>

        <h2 className="portal-name">
          Grievance Redressal Portal
        </h2>

      </div>

      {/* Cards three cards  */}

      <div className="container mt-5">

        <div className="row g-5">

          {/* Admin code started from here  */}

         <div className="col-lg-4">

  <Link
    to="/admin-login"
    className="text-decoration-none text-dark"
  >

    <div className="card-box">

      <img
        src={admin}
        alt=""
        className="card-icon"
      />

      <div>

        <h3>Admin Login</h3>

        <p>For Admin Login</p>

      </div>

    </div>

  </Link>

</div>
          {/* Registration  started */}

         <div className="col-lg-4">

  <Link
    to="/user-register"
    className="text-decoration-none text-dark"
  >

    <div className="card-box">

      <img
        src={registration}
        alt="User Registration"
        className="card-icon"
      />

      <div>

        <h3>User Registration</h3>

        <p>For User Registration</p>

      </div>

    </div>

  </Link>

</div>
          {/* User section started */}

                    {/* User section started */}

          <div className="col-lg-4">

            <Link
              to="/user-login"
              className="text-decoration-none text-dark"
            >

              <div className="card-box">

                <img
                  src={user}
                  alt="User Login"
                  className="card-icon"
                />

                <div>

                  <h3>User Login</h3>

                  <p>For User Login</p>

                </div>

              </div>

            </Link>

          </div>

        </div>
      </div>

      {/* Footer */}

      <footer>

        All right reserved © 2026-2027 Designed and Developed by RUPALEE SHARMA

      </footer>

    </>
  );
}

export default Home;