import {DarkThemeToggle, Navbar} from "flowbite-react";
import Image from "next/image";
import {FC} from "react";
import {useSidebarContext} from "../../context/SidebarContext";
import {NavbarLink} from "@components/Navbar/NavbarLink";
import useColorMode from "../../hooks/useColorMode";
import DropdownMenu from "@components/dropdown-menu/DropdownMenu";


interface Props {
    disableSideBar: boolean,
    disableLinks: boolean,
    profilePicSrc: string | undefined,
    username: string,
    hasProfile: boolean
}

const Header: FC<Props> = function ({
                                        disableSideBar,
                                        disableLinks,
                                        profilePicSrc,
                                        username,
                                        hasProfile
                                    }) {
        const {
            isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens
        } =
            useSidebarContext();
        const [colorMode, setColorMode] = useColorMode();

        return (
            <header className="sticky top-0 left-0 right-0 z-20">
                <Navbar fluid className="space-x-12">
                    {!disableSideBar && isPageWithSidebar && (
                        <button
                            aria-controls="sidebar"
                            aria-expanded="true"
                            className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
                            onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                        >
                            {isOpenOnSmallScreens ? (
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            )}
                        </button>
                    )}
                    <Navbar.Brand href="/">
                        <div className="hidden sm:block mt-1">
                            <Image
                                alt="Tigerbook logo"
                                height="100"
                                src="/static/Tigerbook.png"
                                width="100"
                            />
                        </div>
                    </Navbar.Brand>

                    <div className="flex md:order-2 md:w-[150px] justify-center  items-center gap-x-4">
                        {!disableLinks && <Navbar.Toggle/>}
                        <DarkThemeToggle onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}/>
                        <DropdownMenu profilePicSrc={profilePicSrc} username={username} hasProfile={hasProfile}/>
                    </div>
                    {!disableLinks &&
                        <>
                            <Navbar.Collapse>
                                <NavbarLink href="/search">Search</NavbarLink>
                                <NavbarLink href="/list">List</NavbarLink>
                                {/*<NavbarLink href="/groups">Groups</NavbarLink>*/}
                                <NavbarLink href="/notes">Notes</NavbarLink>
                                <NavbarLink href="/map">Map</NavbarLink>
                                <NavbarLink href="/suggest">Suggest</NavbarLink>
                            </Navbar.Collapse>
                        </>
                    }
                </Navbar>
            </header>
        );
    }
;

Header.defaultProps = {
    profilePicSrc: undefined,
}

export default Header;
