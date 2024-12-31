"use client";
import React from 'react';
import HeroTitle from "@/app/components/baseComponents/HeroTitle";
import ListRecipeComponent from "@/app/components/pageComponents/ListRecipe";
import {getMainBodyCss} from "@/app/utils/CssUtils";

export default function ListRecipePage() {
    return (
        <section className={getMainBodyCss()}>
            <HeroTitle title={"All Recipe"}/>
            <ListRecipeComponent></ListRecipeComponent>
        </section>
    );
}
