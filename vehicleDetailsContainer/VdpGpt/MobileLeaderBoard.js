import { connect } from 'react-redux';
import Leaderboard from 'containers/common/DFPAdUnits/views/Leaderboard';
import { mobileLeaderboardSelector } from './selectors';

export default connect(mobileLeaderboardSelector)(Leaderboard);
