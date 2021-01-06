import Link from 'next/link';

export default ({ currentUser }) => {

    const links = [
        !currentUser && {label: 'Sign Up', href:"/auth/signup"},
        !currentUser && {label: 'Sign In', href:"/auth/signin"},
        currentUser && {label: 'Sign Out', href:"/auth/signout"}
    ]
    .filter(linkConfig => linkConfig) // Filter only true values
    .map(({label, href}) => 
        <li className="nav-item" key={href}>
            <Link href={href}>
                <a className="nav-link">{label}</a>
            </Link>
        </li>);

    return(
        <nav className="navbar navbar-dark bg-dark">
            <Link href="/">
                <a className="navbar-brand">WeConcert</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>

        </nav>
    )
};