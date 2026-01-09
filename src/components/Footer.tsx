import InstaIcon from '../assets/icons/insta.svg'
import LinkedInIcon from '../assets/icons/linkedin.svg'

export const Footer = () => {
  return(
    <footer className='py-5 sm:py-3 bg-black text-white/60 border-t border-white/20'>
      <div className="px-4">
        <div className="container">
          <div className='flex flex-col gap-5 sm:gap-3 sm:flex-row sm:justify-between sm:items-center'>
            <div className="text-center text-sm">© 2026 • Rian Cahyo</div>
            <ul className='flex justify-center gap-2.5 sm:gap-2'>
              <li>
                <a 
                  href="https://www.linkedin.com/in/riancahyoanggoro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity inline-block"
                >
                  <LinkedInIcon className="w-6 h-6 sm:w-6 sm:h-6"/>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/rianchyoa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity inline-block"
                >
                  <InstaIcon className="w-6 h-6 sm:w-6 sm:h-6"/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
};