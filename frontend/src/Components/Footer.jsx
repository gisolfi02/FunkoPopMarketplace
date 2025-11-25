import styles from "../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

library.add(
  faFacebook,
  faInstagram,
  faXTwitter,
  faGithub,
  faLinkedin,
  faEnvelope
);

function Footer() {
  return (
    <footer>
      <div className={styles.contactContainer}>
        <h2 className={styles.h2Footer}>Contatti:</h2>
        <p className={styles.pFooter}>
          <FontAwesomeIcon
            icon={["fas", "envelope"]}
            size="lg"
            style={{ color: "#3C6FE1", marginRight: "7px" }}
          />
          a.gisolfi4@studenti.unisa.it
        </p>
        <p className={styles.pFooter}>
          <FontAwesomeIcon
            icon={["fas", "envelope"]}
            size="lg"
            style={{ color: "#3C6FE1", marginRight: "7px" }}
          />
          s.cafaro7@studenti.unisa.it
        </p>
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.pFooter}>Funko Pop MarketPlace © 2025 </p>
        <p className={styles.pFooter}>
          Realizzato da: Andrea Gisolfi e Silvana Cafaro
        </p>
        <p className={styles.pFooter}>Università degli Studi di Salerno</p>
      </div>
      <div className={styles.socialContainer}>
        <h2 className={styles.h2Footer}>Seguici su:</h2>
        <div className={styles.socialIconsContainer}>
          <a
            className={styles.socialIcons}
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "facebook"]}
              size="2xl"
              style={{ color: "#3C6FE1" }}
            />
          </a>
          <a
            className={styles.socialIcons}
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "instagram"]}
              size="2xl"
              style={{ color: "#3C6FE1" }}
            />
          </a>
          <a
            className={styles.socialIcons}
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "x-twitter"]}
              size="2xl"
              style={{ color: "#3C6FE1" }}
            />
          </a>
          <a
            className={styles.socialIcons}
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "github"]}
              size="2xl"
              style={{ color: "#3C6FE1" }}
            />
          </a>
          <a
            className={styles.socialIcons}
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "linkedin"]}
              size="2xl"
              style={{ color: "#3C6FE1" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
