import { useState } from "react";
import ListeCategories from "./Categories/ListeCategories";
import TopBar from "./Categories/TopBar";
import EvenementsPopulaire from "./Evenements/EvenementsPopulaire";
import ListeEvenement from "./Evenements/ListeEvenement";
import HeaderLayout from "./HeaderLayout";

function Accueil() {
    const [filtreCategorie, setFiltreCategorie] = useState(null);

    return (

        <HeaderLayout>
            <TopBar />
            <ListeCategories onFiltrer={setFiltreCategorie} filtreActif={filtreCategorie} />
            <ListeEvenement filtreCategorie={filtreCategorie} />
            <EvenementsPopulaire />
        </HeaderLayout>



    );
}
export default Accueil;