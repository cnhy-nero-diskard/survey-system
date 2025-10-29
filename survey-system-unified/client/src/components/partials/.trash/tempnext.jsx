import { useNavigate } from 'react-router-dom';
import imgoverlay from '../../components/img/profile.png';




const navigate = useNavigate(); // Initialize useNavigate
const handleNextClick = () => {
  navigate('/'); // Navigate to the next question
};

        <Button onClick={handleNextClick} className="next-button">
          NEXT
        </Button>
