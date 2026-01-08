import InstaIcon from '../assets/icons/insta.svg'
import LinkedInIcon from '../assets/icons/linkedin.svg'

export const Footer = () => {
  return(
    <footer className='py-5 bg-black text-white/60 border-t border-white/20'>
      <div className="px-4">
        <div className="container">
          <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
            <div className="text-center">© 2026 • Rian Cahyo</div>
            <ul className='flex justify-center gap-2.5'>
              <li>
                <a 
                  href="https://www.linkedin.com/in/riancahyoanggoro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <LinkedInIcon/>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/rianchyoa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <InstaIcon/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
};