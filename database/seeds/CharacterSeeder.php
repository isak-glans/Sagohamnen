<?php

use Illuminate\Database\Seeder;

class CharactersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('characters')->insert([
            'id'               => 1,
            'user_id'          => 1,
            'campaign_id'      => 1,
            'name'             => "Terry",
            'description'      => "Karaktär
Terry är en hetlevrad ung man. Han hyser fiendskap mot de rika, eftersom de sög ut hans familj, och bönderna på landsbygden. Han skuldbelägger de rika för de mesta. Det är enda sättet för det vanliga folket att få del av landets rikedomar, är genom stöld. De rika kommer inte att dela med sig. Bakgrund Terry växte upp i en fattig familj. Fadern var tandsmed och drack. Modern dog av sjukdom. När han var åtta år jobbade han som koleldare. Två år senare flydde han hemifrån och drev omkring i byar, tills han blev omhändertagen av en bonde. Vid elvaårsåldern blev Terry indragen i bondens kamp mot mot adeln.* Detta innebar att Terry fick lära sig att bruka svärd och våld. Efter flera år av elände, bestämde sig Terry för att flytta och bosätta sig i en stad.
Det dröjde inte länge förrän Terry blev upptagen i en tjuvliga. Han blev med tiden en kriminell typ som smög på de rika och gjorde inbrott.
När Terry fyllde 20 fick han ett jobb som lärjunge hos en slaktare.
Fem år senare fick Terry kontakt med en grupp äventyrare, som tog med honom på ett äventyr långt ut i vildmarken.* När han återvände var han en smula annorlunda. Något i hans sätt att röra sig antydde om att han blivit betydligt äldre; både fysiskt och mentalt. Men han talar sällan om vad som hände ute i vildmarken. Resultat av färder & äventyr..",
            'secret_data'      => "Knivsätt. Madrass.",
            'portrait_id'         => 3,
            'created_at'       => new DateTime('01/10/2016'),
            'updated_at'       => new DateTime('01/10/2016'),
            'status'           => 3,
        ]);
        DB::table('characters')->insert([
            'id'               => 2,
            'user_id'          => 2,
            'campaign_id'      => 1,
            'name'             => "Alexus",
            'description'      => "En mystiker.",
            'secret_data'      => "Egentligen trollkarl.",
            'portrait_id'         => 2,
            'created_at'       => new DateTime('01/10/2016'),
            'updated_at'       => new DateTime('01/10/2016'),
            'status'           => 1,
        ]);
        DB::table('characters')->insert([
            'user_id'          => 2,
            'campaign_id'      => 1,
            'name'             => "Morfeus",
            'description'      => "En mystiker.",
            'secret_data'      => "Egentligen trollkarl.",
            'portrait_id'         => 3,
            'created_at'       => new DateTime('01/10/2016'),
            'updated_at'       => new DateTime('01/10/2016'),
            'status'           => 1,
        ]);
        DB::table('characters')->insert([
            'user_id'          => 2,
            'campaign_id'      => 1,
            'name'             => "Zalabar den store",
            'description'      => "En mystiker.",
            'secret_data'      => "Egentligen trollkarl.",
            'portrait_id'         => 4,
            'created_at'       => new DateTime('01/10/2016'),
            'updated_at'       => new DateTime('01/10/2016'),
            'status'           => 1,
        ]);
        DB::table('characters')->insert([
            'user_id'          => 2,
            'campaign_id'      => 1,
            'name'             => "Grimoire",
            'description'      => "En mystiker.",
            'secret_data'      => "Egentligen trollkarl.",
            'portrait_id'         => 5,
            'created_at'       => new DateTime('01/10/2016'),
            'updated_at'       => new DateTime('01/10/2016'),
            'status'           => 2,
        ]);
        DB::table('characters')->insert([
            'user_id'          => 2,
            'campaign_id'      => 1,
            'name'             => "Alexander Mjersko",
            'description'      => "En mystiker.",
            'secret_data'      => "Egentligen trollkarl.",
            'portrait_id'         => 6,
            'created_at'       => new DateTime('01/10/2016'),
            'updated_at'       => new DateTime('01/10/2016'),
            'status'           => 1,
        ]);

    }
}
