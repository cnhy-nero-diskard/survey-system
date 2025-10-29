// src/routes/surveyRoutesConfig.js
/**
 * @typedef {object} Route
 * @property {string} label - The label for the route.
 * @property {string} path - The path for the route.
 * @property {React.ComponentType} component - The React component to render for the route.
 * @property {string} conditionalBlock - The conditional block identifier for the route.
 */

/**
 * @type {Route[]}
 * @description An array of route objects, each defining a survey route configuration.
 */
import LanguageSelector from '../pages/survey/languageselector/LanguageSelector';
import Residence1 from '../pages/survey/residence1/Residence1';
import MainPurpose from '../pages/survey/mainpurpose/MainPurpose';
import VisitFrequencyForm from '../pages/survey/visitfrequencyform/VisitFrequencyForm';
import SurveyConsent from '../pages/survey/surveyconsent/SurveyConsent';
import PrelimForm from '../pages/survey/form/Form';
import Greetings from '../pages/survey/greetings/Greetings';
import BranchingSelect from '../pages/survey/branchingselect/BranchingSelect';
import Page1 from '../pages/survey/page1/Page1';
import SurveyEvaluation05 from '../pages/survey/surveyevaluation1/SurveyEvaluation05';
import SurveyEvaluationb from '../pages/survey/surveyevaluation2/SurveyEvaluationb';
import ThankYouMessage from '../pages/survey/thanku/ThankYouMessage';
import Willrecom from '../pages/survey/reccommevent/Willrecom';
import WhereLearn from '../pages/survey/wherelearn/WhereLearn';
import SurveyVenue from '../pages/survey/surveyvenue/SurveyVenue';
import OpenEnded2 from '../pages/survey/OpenEnded2LIfestyle/OpenEndedLifestyle';
import OpenEnded1Services from '../pages/survey/OpenEnded1Hotel/OpenEndedHotel';
import HowManyVisits from '../pages/survey/events1/HowManyVisits';
import PrimaryAtt from '../pages/survey/events2/PrimaryAtt';
import RateAttraction from '../pages/survey/events3/RateAttraction';
import EventsOpen1 from '../pages/survey/eventsopenended/EventsOpen1';
import AttractionsFeedback from '../pages/survey/eventsopenended2/AttractionsFeedback';
import PackageTourFeedback from '../pages/survey/eventsopenended2/PackageTourFeedback';
import AttractionForm from '../pages/survey/events4/AttractionForm';
import Services2 from '../pages/survey/services2/Services2';
import Services1 from '../pages/survey/services1/Services1';
import DestinationShoppingList from '../pages/survey/services3/DestinationShoppingList';
import VisitCounterAtt from '../pages/survey/hmvisits/VisitCounterAtt';
import TravelQuestion from '../pages/survey/travelquestion/TravelQuestion';
import TravelWith from '../pages/survey/travelwith/TravelWith';
import TravelOptions from '../pages/survey/packagetour1/TravelOptions';
import PackageTourItems from '../pages/survey/packageitems/PackageTourItems';
import PackagePaid from '../pages/survey/packagetourpaid/PackagePaid';
import ExpenseTracker from '../pages/survey/packagerecall/ExpenseTracker';
import PercentageShareList from '../pages/survey/packagerecall2/PercentageShareList';
import ExpenseCompanions from '../pages/survey/expensecompanion/ExpenseCompanions';
import PackTranspo from '../pages/survey/packTranspo/PackTranspo';
import HowManyNights from '../pages/survey/accomodation1/HowManyNights';
import AccommodationForm from '../pages/survey/accomodation2/AccomodationForm';
import BookingForm from '../pages/survey/accomodation3/BookingForm';
import WhereStayed from '../pages/survey/accomodation4/WhereStay_arrival';
import AccomodationOpen2 from '../pages/survey/accomodation6o/AccomodationOpen2';
import Transportation3 from '../pages/survey/transportation3/Transportation3';
import Transportation1 from '../pages/survey/transportation1/Transportation1';
import Transportation2 from '../pages/survey/transportation2/Transportation2';
import PProfile2 from '../pages/survey/personalprofile2/PProfile2';
import PProfile1 from '../pages/survey/personalprofile1/PProfile1';
import ProponentLgu from '../pages/survey/proponentlgu/ProponentLgu';
import OpenEndedTranspo from '../pages/survey/OpenEndedTransportation/OpenEndedTranspo';
import TouchpointFeedback from '../pages/survey/accomodation5o/AccomodationFeedback';
import ThankYouMessageF from '../pages/survey/thanku/ThankYouMessageF';
import OpenEndedTranspov2 from '../pages/survey/OpenEndedTransportation/OpenEndedTranspov2';
import OpenEndedServicev2 from '../pages/survey/OpenEnded1Hotel/OpenEndedHotelv2';
import OpenEndedLifestylev2 from '../pages/survey/OpenEnded2LIfestyle/OpenEndedLifestylev2';


export const sroutes = [
    { label: 'Language', path: '', component: LanguageSelector, conditionalBlock: 'universal'},
    { label: 'Page 1', path: 'page1', component: Page1, conditionalBlock: 'surveytpms'},
    { label: 'Survey Consent', path: 'surveyconsent', component: SurveyConsent, conditionalBlock: 'surveytpms'},
    { label: 'Gmail Form', path: 'prelimform', component: PrelimForm, conditionalBlock: 'surveytpms'},
    { label: 'Greetings', path: 'greetings', component: Greetings, conditionalBlock: 'surveytpms'},
    { label: 'Residence 1', path: 'residence1', component: Residence1, conditionalBlock: 'surveytpms'},
    { label: 'Transportation 1', path: 'outsidemodetranspo', component: Transportation1, conditionalBlock: 'oprovblock'},
    { label: 'Transportation 2', path: 'insidemodetranspo', component: Transportation2, conditionalBlock: 'iprovblock'},
    { label: 'Main Purpose', path: 'mainpurpose', component: MainPurpose, conditionalBlock: 'surveytpms'},
    { label: 'Visit Frequency Form', path: 'visitfrequencyform', component: VisitFrequencyForm, conditionalBlock: 'surveytpms'},
    { label: 'Travel Question', path: 'travelquestion', component: TravelQuestion, conditionalBlock: 'surveytpms'},
    { label: 'Travel With', path: 'travelwith', component: TravelWith, conditionalBlock: 'surveytpms'},
    
    { label: 'Travel Options', path: 'traveloptions', component: TravelOptions, conditionalBlock: 'surveytpms'},
    { label: 'Package Tour Items', path: 'packagetouritems', component: PackageTourItems, conditionalBlock: 'pkgtour'},
    { label: 'Package Paid', path: 'packagepaid', component: PackagePaid, conditionalBlock: 'pkgtour'},
    { label: 'Package Tour Feedback', path: 'packagetourfeedback', component: PackageTourFeedback, conditionalBlock: 'pkgtour'},
    
    { label: 'Expense Tracker', path: 'expensetracker', component: ExpenseTracker, conditionalBlock: 'indtravel'},
    { label: 'Percentage Share List', path: 'percentagesharelist', component: PercentageShareList, conditionalBlock: 'perclist'},
    { label: 'Expense Companions', path: 'expensecompanions', component: ExpenseCompanions, conditionalBlock: 'indtravel'},
    
    //                  !!!!!!!!!!!!!!!!!!!!!!   BRANCHING SELECT !!!!!!!!!!!!!!!!!!!!!!
    { label: 'Branching Select', path: 'branchingselect', component: BranchingSelect, conditionalBlock: 'surveytpms'},
    
    
    { label: 'How Many Nights', path: 'howmanynights', component: HowManyNights, conditionalBlock: 'accom'},
    { label: 'Accommodation Form', path: 'accommodationform', component: AccommodationForm, conditionalBlock: 'yesaccom'},
    { label: 'Where Stay Departure', path: 'wherestayed', component: WhereStayed, conditionalBlock: 'noaccom'},
    { label: 'Booking Form', path: 'bookingform', component: BookingForm, conditionalBlock: 'yesaccom'},
    { label: 'Accommodation Open 2 (GENERAL) ', path: 'accomodationopen2', component: AccomodationOpen2, conditionalBlock: 'accom'},
    
    
    
    
    
    { label: 'Pack Transpo', path: 'packtranspo', component: PackTranspo, conditionalBlock: 'transp'},
    { label: 'Transportation 3', path: 'transportation3', component: Transportation3, conditionalBlock: 'transp'},
    { label: 'Open Ended Transportation', path: 'opentranspo', component: OpenEndedTranspov2, conditionalBlock: 'transp'},

    
    { label: 'Primary Attraction', path: 'primaryatt', component: PrimaryAtt, conditionalBlock: 'evatt'},
    { label: 'Visit Counter', path: 'visitcounteratt', component: VisitCounterAtt, conditionalBlock: 'evatt'},
    { label: 'Rate Attraction', path: 'rateattraction', component: RateAttraction, conditionalBlock: 'evatt'},
    { label: 'Attraction Form', path: 'attractionform', component: AttractionForm, conditionalBlock: 'evatt'},
    { label: 'Will Recommend', path: 'willrecom', component: Willrecom, conditionalBlock: 'evatt'},
    { label: 'Where Learn', path: 'wherelearn', component: WhereLearn, conditionalBlock: 'evatt'},
    { label: 'Events Open 1', path: 'eventsopen1', component: EventsOpen1, conditionalBlock: 'evatt'},
    // { label: 'Attractions Feedback', path: 'attractionsfeedback', component: AttractionsFeedback, conditionalBlock: 'evatt'},
    
    
    
    
    
    { label: 'Rate services finance', path: 'servicefinan', component: Services2, conditionalBlock: 'serv'},
    { label: 'Open Ended 1', path: 'openendedservice', component: OpenEndedServicev2, conditionalBlock: 'serv'},
    { label: 'Destination Shopping List', path: 'destshlist', component: DestinationShoppingList, conditionalBlock: 'serv'},
    { label: 'Open Ended Lifestyle', path: 'openendedlifestyle', component: OpenEndedLifestylev2,conditionalBlock: 'serv'},
    
    
    
    
    { label: 'Services 1', path: 'rategeneralpricing', component: Services1, conditionalBlock: 'surveytpms'},
    { label: 'Personal Profile 1', path: 'pprofile1', component: PProfile1, conditionalBlock: 'surveytpms'},
    { label: 'Personal Profile 2', path: 'dates', component: PProfile2, conditionalBlock: 'surveytpms'},
    { label: 'Survey Venue', path: 'surveyvenue', component: SurveyVenue, conditionalBlock: 'surveytpms'},
    // { label: 'Proponent LGU', path: 'proponentlgu', component: ProponentLgu, conditionalBlock: 'surveytpms'},
    { label: 'Survey Evaluation VERSION1', path: 'surveyevaluation05', component: SurveyEvaluation05, conditionalBlock: 'surveytpms'},
    { label: 'Thank You Message', path: 'survey-complete', component: ThankYouMessage, conditionalBlock: 'surveytpms'},
    // { label: '(IGNORE)Where Stay Departure', path: 'wherestaydepart', component: },
    // { label: 'Survey Evaluation VERSION2', path: 'surveyevaluationb', component: },
    // { label: 'How Many Visits', path: 'howmanyvisits', component: HowManyVisits, conditionalBlock: 'evatt'},
    // { label: 'Accommodation Open 1', path: 'accomodationopen1', component: AccomodationOpen1, conditionalBlock: 'accom'},
 
 
    { label: 'FEEDBACK QUICK (OPEN)', path: 'estopenfeedback', component: TouchpointFeedback, conditionalBlock: 'feedback'},
    { label: 'Thank You Message', path: 'feedback-complete', component: ThankYouMessageF, conditionalBlock: 'feedback'},
    
];
