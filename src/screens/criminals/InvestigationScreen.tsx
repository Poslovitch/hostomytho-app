import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn";
import { useUser } from 'services/context/UserContext';
import CustomHeaderEmpty from "components/header/CustomHeaderEmpty";
import { getUserCriminals } from 'services/api/criminals';
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "navigation/Types";
import PrimaryButton from "components/PrimaryButton";
import CustomModal from "components/modals/CustomModal";


export interface Criminal {
    name: string;
    description: string;
    imageId: number;
}

const InvestigationScreen = () => {
    const tw = useTailwind();
    const { user } = useUser();
    const [criminals, setCriminals] = useState<Criminal[]>([]);
    const navigation = useNavigation<RootStackNavigationProp<"Main">>();
    // const investigationProgress = user?.percentageInvestigation || 0;
    // const investigationProgress = 65;
    const [investigationProgress, setInvestigationProgress] = useState(65);
    const [modalVisible, setModalVisible] = useState(false);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [arrestSuccess, setArrestSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const loadCriminals = async () => {
            try {
                const userCriminals = await getUserCriminals(user.id);
                setCriminals(userCriminals);
            } catch (error) {
                console.error(error);
            }
        };
        loadCriminals();
    }, [user.id]);


    const handleArrestAttempt = () => {
        const randomNumber = Math.floor(Math.random() * 101);
        if (randomNumber <= investigationProgress) {
            setArrestSuccess(true);
            setInvestigationProgress(0);
        } else {
            setArrestSuccess(false);
            setInvestigationProgress(prevProgress => prevProgress - 15);
        }
        setModalVisible(false);
        setResultModalVisible(true);
    };


    return (
        <View style={tw('flex-1')}>
            <ImageBackground source={require('images/dark-background.jpg')} style={tw('flex-1')} resizeMode="cover">
                <SafeAreaView style={tw('flex-1')}>
                    <ScrollView contentContainerStyle={tw("flex-grow justify-center items-center")} style={tw('w-full')} >
                        <CustomHeaderEmpty title="Enquête en cours" backgroundColor="bg-whiteTransparent" />

                        <View style={tw('flex-1 p-2 pt-14 justify-center items-center')}>
                            <Image
                                source={require('images/unknown3.jpeg')}
                                style={tw('w-64 h-64')}
                                resizeMode="contain"

                            />

                            <Text style={tw('text-center font-bold font-primary text-lg text-white')}>Taux de certitude par rapport au criminel: {investigationProgress}%</Text>
                            <View style={tw('bg-gray-300 h-4 rounded mt-2 w-96')}>
                                <View
                                    style={[
                                        tw('bg-primary h-full rounded-l'),
                                        { width: `${investigationProgress}%` },
                                    ]}
                                ></View>
                            </View>

                            <TouchableOpacity
                                style={tw('bg-primary py-3 px-6 rounded mt-4')}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={tw('text-white font-bold')}>Tenter l'arrestation</Text>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
            <CustomModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            >
                <View >
                    <Text style={tw('text-lg font-primary')}>Etes-vous sûr de vouloir tenter l'arrestation?</Text>
                    <Text style={tw('text-lg font-primary')}>Si celle-ci échoue, votre taux de certitude baissera.</Text>
                    <TouchableOpacity onPress={handleArrestAttempt} style={tw('mt-5 bg-primary py-3 px-6 rounded self-center')}>
                        <Text style={tw('text-white font-bold text-center')}>Je suis sûr de moi, je me lance</Text>
                    </TouchableOpacity>
                </View>
            </CustomModal>

            <CustomModal isVisible={resultModalVisible} onClose={() => setResultModalVisible(false)}>
                {arrestSuccess === true ? (
                    <>
                        <Text style={tw('font-primary text-lg')}>
                            Dans un ultime espoir, le suspect s'enfuit dans une bouche d'aération. Vous le poursuivez en rampant dans les conduits pendant de longues minutes.
                            Vous finissez par attraper l'un de ses lacets qui était défait et qui traînait derrière.
                            Après l'avoir livré à la police, il est interrogé et enfermé. Il s'agit bien de la personne recherchée.
                            {"\n\n"}
                            Félicitations, vous avez eu du flair et votre enquête a mené à la bonne piste !
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CriminalsCaught')} style={tw('mt-5 bg-primary py-3 px-6 rounded self-center')}>
                            <Text style={tw('text-white font-bold text-center')}>Voir le criminel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={tw('font-primary text-lg')}>
                            La personne que vous arrêtez s'appelle Kévin Bontrain. Il est menuisier, construit de belles armoires, et ne ferait pas de mal à une mouche. Ce n'est donc malheureusement pas le criminel.
                            {"\n\n"}
                            Votre enquête continue !
                        </Text>
                    </>
                )}
            </CustomModal>
        </View>
    );
};

export default InvestigationScreen;
