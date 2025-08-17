import logoutIcon from '../../assets/sign-out.png';
import "../../styles/SideMenu.css"
export default function SideMenu(){
    return(
        <div className="sidemenu">
            <ul className="sidemenu-list">
                <li className="sidemenu-item">
                    <a href="/dashboard" className="sidemenu-link">
                        <i className='bx bx-dashboard'></i>
                        <div>
                            <span>Dashboard</span>
                            <p>View current sessions and notifications</p>
                        </div>
                    </a>
                </li>
                <li className="sidemenu-item">
                    <a href="/sessions" className="sidemenu-link">
                        <i className='bx bx-history'></i>
                        <div>
                            <span>Sessions</span>
                            <p>View your session history</p>
                        </div>
                    </a>
                </li>
                <li className="sidemenu-item">
                    <a href="/profile" className="sidemenu-link">
                        <i className='bx bx-user'></i>
                        <div>
                            <span>Profile</span>
                            <p>View and edit your profile</p>
                        </div>
                    </a>
                </li>
                
                <li className="sidemenu-item">
                    <a href="/logout" className="sidemenu-link">
                        <i className='bx'><img src={logoutIcon} alt="Logout Icon" /></i>
                        <div>
                            <span>Logout</span>
                            <p>Sign out of your account</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    )
}