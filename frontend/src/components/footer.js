import React from 'react';
import './footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="frame-20">
      <div className="frame-13">
        <div className="frame-9">
          <div className="logo">
            <div className="text-wrapper-14">Exclusive</div>
          </div>
          <div className="text-wrapper-15">Subscribe</div>
        </div>
        <p className="text-wrapper-16">Get 10% off your first order</p>
        <div className="send-mail">
          <div className="text-wrapper-17">Enter your email</div>
          <img className="IconSend" src="/assets/icon-send.svg" alt="Send Icon" />
        </div>
      </div>

      <div className="frame-9">
        <div className="text-wrapper-18">Support</div>
        <div className="frame-13">
          <p className="element-bijoy-sarani">111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh.</p>
          <div className="text-wrapper-16">exclusive@gmail.com</div>
          <div className="text-wrapper-16">+88015-88888-9999</div>
        </div>
      </div>

      <div className="frame-9">
        <div className="text-wrapper-18">Account</div>
        <div className="frame-13">
          <div className="text-wrapper-19">My Account</div>
          <div className="text-wrapper-16">Login / Register</div>
          <div className="text-wrapper-16">Cart</div>
          <div className="text-wrapper-16">Wishlist</div>
          <div className="text-wrapper-16">Shop</div>
        </div>
      </div>

      <div className="frame-9">
        <div className="text-wrapper-18">Quick Links</div>
        <div className="frame-13">
          <div className="text-wrapper-19">Privacy Policy</div>
          <div className="text-wrapper-16">Terms of Use</div>
          <div className="text-wrapper-16">FAQ</div>
          <div className="text-wrapper-16">Contact</div>
        </div>
      </div>

      <div className="frame-9">
        <div className="text-wrapper-18">Download App</div>
        <div className="frame-12">
          <p className="text-wrapper-20">Save $3 with App - New Users Only</p>
          <div className="frame-2">
            <div className="qr-code">
              <img className="qrcode" alt="QR Code" src="/assets/QrCode.svg" />
            </div>
            <div className="frame-17">
              <img className="google-play" src="/assets/GooglePlay.svg" alt="Google Play Icon" />
              <img className="app-store" alt="App Store Icon" src="/assets/AppStore.svg" />
            </div>
          </div>
        </div>
        <div className="frame-21">
          <img className="facebook" src="/assets/icon-Facebook.svg" alt="Facebook Icon" />
          <img className="icon-instance-node" src="/assets/Group.svg" alt="Twitter Icon" />
          <img className="instagram" src="/assets/icon-instagram.svg" alt="Instagram Icon" />
          <img className="linkedIn" src="/assets/icon-Linkedin.svg" alt="LinkedIn Icon" />
        </div>
      </div>
    </div>

    <div className="frame-18">
      <div className="under-line-6" />
      <div className="frame-wrapper">
        <div className="frame-19">
          <img className="icon-copyright" src="/assets/icon-copyright.svg" alt="Copyright Icon" />
          <p className="text-wrapper-13">Copyright Rimel 2022. All rights reserved</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
