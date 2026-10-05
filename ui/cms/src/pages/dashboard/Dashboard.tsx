import SectionLayoutComponent from "../../components/SectionLayoutComponent";
import useAuthContext from "../../context/useAuthContext";

export default function Dashboard() {
    const { user } = useAuthContext();

    return (
        <SectionLayoutComponent
            title="Dashboard"
            description={`Welcome back ${user.name}`}
        >
            <h2>Welcome</h2>
        </SectionLayoutComponent>
    );
}
