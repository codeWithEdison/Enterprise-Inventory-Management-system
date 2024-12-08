
import { Link } from 'react-router-dom';
import { 

    Code,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200  "> 
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">

        {/* Bottom Section */}
        <div className=" pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {currentYear} UR HG Stock. All rights reserved.
            </p>
            <Link 
                to="/developers"
                target='_blank' 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Code className="h-4 w-4" />
                Meet the Developers
              </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 md:mt-0">
              Powered by 
              <a
                href='https://binaryhub.programmerdatch.com/'
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
              >
                Binary Hub
                <Heart className="h-4 w-4 text-red-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;