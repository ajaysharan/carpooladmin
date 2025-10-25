import { useCallback, useEffect } from "react";
import AxiosHelper from "../helper/AxiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from '../redux/theme/themeSlice'

const CommonProvider = ({ children }) => {

    const dispatch = useDispatch();
    const { favicon, application_name, meta_title, meta_keyword, meta_description } = useSelector(store => store.theme.settings);

    const hasSettings = !!(application_name || favicon); 

    const loadSettings = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`/settings/1,3`);
            if (data?.status === true) {
                dispatch(updateSettings(data?.data));
            }
        } catch (error) {
         console.error("Failed to load settings", error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!hasSettings) {
        loadSettings();
        }
    }, [hasSettings, loadSettings]);

    useEffect(() => {
        if (!application_name) return;
        const metaDescription = document.querySelector('meta[name="description"]');
        const metaTitle = document.querySelector('meta[name="title"]');
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        const metaIcons = document.querySelectorAll('link[meta="icon"]')

        document.title = application_name || 'Loading...';
        if (metaTitle) metaTitle.content = meta_title;
        if (metaDescription) metaDescription.content = meta_description;
        if (metaKeywords) metaKeywords.content = meta_keyword;

        [...metaIcons].forEach(link => { link.href = favicon });

    }, [favicon, application_name, meta_title, meta_description, meta_keyword])

    return children
}

export default CommonProvider