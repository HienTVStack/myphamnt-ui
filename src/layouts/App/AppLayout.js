// React
import { useEffect, useState } from "react";
// React-router-dom
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// Material UI
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
// React-redux
import { useDispatch } from "react-redux";
// Components
import Loading from "../../components/Loading";
import AppBarHeader from "../components/AppBarHeader";
import Header from "../components/Header";
import NavbarButtonDesktop from "../components/NavbarButtonDesktop";
//
import { getCategories, setUser } from "../../redux/actions";
// Utils
import authUtil from "../../utils/authUtil";
import categoryApi from "../../api/categoryApi";
// -----------------------------------------

function AppLayout() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const matches = useMediaQuery(theme.breakpoints.up("md"));
    const [loading, setLoading] = useState(true);
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("login");

    useEffect(() => {
        // Check login
        const checkAuth = async () => {
            if (token) {
                localStorage.setItem("token", token);
            }
            const user = await authUtil.isAuthenticated();

            dispatch(setUser(user));
        };
        // Handle set category
        const getAllCategory = async () => {
            try {
                const res = await categoryApi.getAll();
                if (res.message === "OK") {
                    dispatch(getCategories(res.categories));
                }
            } catch (error) {
                alert(error);
                console.log(error);
            }
        };

        checkAuth();
        getAllCategory();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    return loading ? (
        <Loading fullHeight />
    ) : (
        <Box>
            <AppBarHeader />
            <Header />
            <NavbarButtonDesktop />
            <Box mt={matches ? "120px" : "184px"}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout;
