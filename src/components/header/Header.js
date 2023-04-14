import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config";
import Loader from "../loader/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  SET_ACTIVE_USER,
  REMOVE_ACTIVE_USER,
} from "../../redux/slice/authSlice";

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        e<span>Shop</span>.
      </h2>
    </Link>
  </div>
);

const cart = (
  <span className={styles.cart}>
    <Link to="/cart" style={{ textDecoration: "none" }}>
      Cart
      <ShoppingCartIcon />
      <p>0</p>
    </Link>
  </span>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  console.log(photoURL);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("LogOut successful");
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  };

  //  shoing currently active user

  // charkhaniakash@gmail.com

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);

        //  this below code is for if user dont have username
        if (user.displayName === null) {
          // charkhaniakash@gmail.com
          const u1 = user.email.slice(0, -10);
          // charkhaniakash
          const firstLetter = u1.charAt(0).toUpperCase();
          // Charkhaniakash
          const uName = firstLetter + u1.slice(1, u1.length);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        setDisplayName(user.displayName);
        setPhotoURL(user.photoURL);
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userID: user.uid,
          })
        );
      } else {
        setDisplayName("");
        setPhotoURL("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, displayName]);

  return (
    <>
      {isLoading && <Loader />}
      <header>
        <div className={styles.header}>
          {logo}
          <nav
            className={
              showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
            }
          >
            <div
              className={
                showMenu
                  ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                  : `${styles["nav-wrapper"]}`
              }
              onClick={hideMenu}
            ></div>
            <ul onClick={hideMenu}>
              <li className={styles["logo-mobile"]}>
                <Link to="/">{logo}</Link>
                <CloseIcon />
              </li>
              <li>
                <NavLink
                  to="/"
                  style={{ textDecoration: "none" }}
                  className={activeLink}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  style={{ textDecoration: "none" }}
                  className={activeLink}
                >
                  contact
                </NavLink>
              </li>
            </ul>

            <div className={styles["header-right"]} onClick={hideMenu}>
              <span className={styles.links}>
                {!displayName ? (
                  <NavLink className={activeLink} to="/login">
                    Login
                  </NavLink>
                ) : (
                  <a href="#home" style={{}}>
                    <img
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                      }}
                      alt=""
                      src={photoURL}
                    />{" "}
                    Hi, <span style={{ color: "red" }}>{displayName}</span>
                  </a>
                )}

                {displayName ? (
                  <>
                    <NavLink className={activeLink} to="/orderhistory">
                      My Order
                    </NavLink>
                    {!displayName ? (
                      <NavLink className={activeLink} to="/register">
                        Register
                      </NavLink>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}

                {displayName ? (
                  <NavLink
                    className={activeLink}
                    to="/logout"
                    onClick={userSignOut}
                  >
                    Log Out
                  </NavLink>
                ) : (
                  ""
                )}
              </span>
              {cart}
            </div>
          </nav>
          <div className={styles["menu-icon"]}>
            {cart}
            <MenuIcon onClick={toggleMenu} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

