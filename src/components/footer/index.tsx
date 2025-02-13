import Logo from "../../assets/sitelogo.png";

const Footer = () => {
  return (
    <footer className="bg-primary-100 py-16">
      <div className="justify-content mx-auto w-5/6 gap-16 md:flex">
        <div className="mt-16 basis-1/2 md:mt-0">
          <img alt="logo" src={Logo} />
          <p className="my-5">
            Forbes News Network creates fearless content across broadcast,
            television and digital while preserving a century-old legacy with
            unflinching determination to deliver the truth of time.
          </p>
          <p>© 2025 ForbesNews™. All Rights Reserved.</p>
        </div>
        <div className="mt-16 basis-1/4 md:mt-0">
          <h4 className="font-bold">Links</h4>
          <p className="my-5">LinkedIn</p>
          <p className="my-5">Github</p>
          <p>Leetcode</p>
        </div>
        <div className="mt-16 basis-1/4 md:mt-0">
          <h4 className="font-bold">Contact Us</h4>
          <p className="my-5">Kolkata , India</p>
          <p className="my-5">karickdasdk@gmail.com</p>
          <p>(+91) 9563512791</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
