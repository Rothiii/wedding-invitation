import Hero from '@/pages/Hero'
import SaveTheDate from '@/pages/SaveTheDate'
import Events from '@/pages/Events'
import Location from '@/pages/Location';
import Wishes from '@/pages/Wishes';
import Gifts from '@/pages/Gifts';
import PhotoGallery from '@/components/sections/PhotoGallery';
import { useInvitation } from '@/context/InvitationContext';
import { useTheme } from '@/context/ThemeContext';

// Main Invitation Content
export default function MainContent() {
    const { config } = useInvitation();
    const { theme } = useTheme();

    // Get photos from config
    const photos = config?.photos || [];

    return (
        <>
            <Hero />
            <SaveTheDate />
            <Events />
            <Location />
            {photos.length > 0 && (
                <PhotoGallery
                    photos={photos}
                    theme={theme}
                    layout="masonry"
                    title="Galeri Foto"
                    subtitle="Momen-momen indah perjalanan cinta kami"
                />
            )}
            <Gifts />
            <Wishes />
        </>
    )
}