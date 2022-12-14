const TRANSITION_DURATION = 0.6;


class Slide {
	constructor(text, showForward=()=>0, hideForward=()=>0, showBackwards=()=>0, hideBackwards=()=>0, display=()=>0) {
		this.text = text;
		
		this.showForward = function() {  // transition in
			$("mainText").innerHTML = this.text;
			$("mainText").style.opacity = 1;
			showForward();
		};
		
		this.hideForward = function() { // transition out
			$("mainText").style.opacity = 0;
			hideForward();
		};
		
		this.showBackwards = function() {  // transition in
			$("mainText").innerHTML = this.text;
			$("mainText").style.opacity = 1;
			showBackwards();
		};
		
		this.hideBackwards = function() { // transition out
			$("mainText").style.opacity = 0;
			hideBackwards();
		};
		
		this.display = display; // continuous animation when displayed
	}
}


var transitioningSlide = false;


function transitionSlides(s1, s2, forward=true) {
	// hide s1 elements
	transitioningSlide = true;
	forward ? s1.hideForward() : s1.hideBackwards();
	
	setTimeout(function() {
		// show s2 elements
		updateSlideNumber();
		forward ? s2.showForward() : s2.showBackwards();
		
		setTimeout(function() {
			transitioningSlide = false;
			s2.display();
		}, TRANSITION_DURATION * 1000);
	}, TRANSITION_DURATION * 1000);
}

function transitionForward(s1, s2) {
	transitionSlides(s1, s2, true);
}

function transitionBackwards(s1, s2) {
	transitionSlides(s1, s2, false);
}


function updateSlideNumber() {
	$("slideNumber").innerHTML = currentSlideId + 1 + "/" + currentSlides.length;
}


var emptySlide = new Slide("",
	()=>0,
	()=>0,
	()=>0,
	function() {
		$("diagram").style.opacity = 0;
		graph1.hode();
		graph2.hode();
		graph3.hode();
	});

var currentSlides = null;
var currentSlideId = 0;


function previousSlide() {
	if (transitioningScreen || transitioningSlide) return;
	if (currentSlideId > 0) {
		currentSlideId --;
		transitionBackwards(currentSlides[currentSlideId + 1], currentSlides[currentSlideId]);
	} else {
		showTitleScreen();
	}
}


function nextSlide() {
	if (transitioningScreen || transitioningSlide) return;
	if (currentSlideId < currentSlides.length - 1) {
		currentSlideId ++;
		transitionForward(currentSlides[currentSlideId - 1], currentSlides[currentSlideId]);
	} else {
		showTitleScreen();
	}
}

// init slides

var slidesWhat = [
	new Slide(L({
			en: `Welcome!<br>In this first chapter, we will see how to simulate the evolution of an epidemic and explain what is <i>the Curve</i> everyone is worried about.`,
			fr: `Bienvenue !<br>Dans ce premier chapitre, nous verrons comment simuler l'??volution d'une ??pid??mie et expliquerons ce qu'est <i>la Courbe (the Curve)</i> dont tout le monde parle.`,
			es :`??Bienvenida!<br>En este primer cap??tulo, vamos a ver c??mo simular la evoluci??n de una epidema y explicar cu??l es <i>la Curva (the Curve)</i> que preocupa a todo el mundo.`
		}),
		function () {
			$("mainText").style.left = "5%";
			$("mainText").style.bottom = "45%";
		},
		()=>0,
		function () {
			$("mainText").style.bottom = "45%";
		}),
	
	new Slide(L({
			en: `<b>WARNING</b><br><br>The presented simulations are greatly simplified compared to reality. Therefore, they are not intended to give precise and predictive numbers. The observed trends are still representative of reality.`,
			fr: `<b>ATTENTION</b><br><br>Les simulations pr??sent??es ici sont grandement simplifi??es par rapport ?? la r??alit??. Leur but n'est donc pas de fournir des chiffres pr??cis ou pr??dictifs. Les tendances observ??es restent toutefois repr??sentatives de la r??alit??.`,
			es :`<b>CUIDADO</b><br><br>Las simulaciones presentadas en esta web son ampliamente simplificadas en comparaci??n con la realidad. Por lo tanto, su objetivo no es proporcionar cifras exactas o predictivas. Sin embargo, las tendencias observadas siguen representativas de la realidad.`
		}),
		function() {
			$("mainText").style.bottom = "42%";
		},
		function () {
			diagram.reset();
			diagram.draw();
		},
		function() {
			$("mainText").style.bottom = "42%";
		}),
	
	new Slide(L({
			en: `To simulate an epidemic, we start with a batch of healthy people, <span class="S"><i>Susceptible</i> (S)</span> to get ill.`,
			fr: `Pour simuler une ??pid??mie, on commence avec un ensemble de personnes en bonne sant??, <span class="S"><i>Susceptibles</i> (S)</span> de tomber malade.`,
			es: `Para simular una epidemia, comenzamos con un grupo de personas sanas,<br><span class="S"><i>Susceptibles</i> (S)</span> de enfermarse.`
		}),
		function () {
			$("mainText").style.bottom = "5%";
			$("diagram").style.opacity = 1;
			
			setTimeout(function() {
				diagram.show("S");
			}, TRANSITION_DURATION * 1000);
		},
		function() {
			diagram.show("S_to_I");
		},
		()=>0,
		function() {
			diagram.hide("S");
		}),
	
	new Slide(L({
			en: `<span class="S">Susceptible</span> people can get <span class="I"><i>Infected</i> (I)</span>.`,
			fr: `Les personnes <span class="S">Susceptibles</span> peuvent devenir <span class="I"><i>Infect??es</i> (I)</span>.`,
			es: `Las personas <span class="S">Susceptibles</span> pueden convertirse en personas <span class="I"><i>Infectadas</i> (I)</span>.`
		}),
		function() {
			diagram.show("I");
		},
		function() {
			diagram.show("I_to_R");
		},
		()=>0,
		function() {
			diagram.hide("I");
			diagram.hide("S_to_I");
		}),
	
	new Slide(L({
			en: `And <span class="I">Infected</span> people <span class="R"><i>Recover</i> (R)</span>, acquiring an immunity to the disease.`,
			fr: `Et les personnes <span class="I">Infect??es</span> se <span class="R"><i>R??tablissent</i> (R)</span> et deviennent immunis??es contre la maladie.`,
			es: `Y las personas <span class="I">Infectadas</span> se <span class="R"><i>Recuperan</i> (R)</span> y llegan a ser inmunes a la enfermedad.`
		}),
		function() {
			diagram.show("R");
		},
		()=>0,
		()=>0,
		function() {
			diagram.hide("R");
			diagram.hide("I_to_R");
		}),
	
	new Slide(L({
			en: `This model is called the <i>SIR model</i> and is one of the simplest mathematical models capable of predicting the evolution of infectious diseases.`,
			fr: `Ce mod??le se nomme le <i>mod??le SIR</i> et est l'un des mod??les math??matiques les plus simples capables de pr??dire l'??volution d'une maladie infectieuse.`,
			es: `Este modelo se llama el <i>modelo SIR</i> y es uno de los modelos mathem??ticos m??s simples capaces de predecir la evoluci??n de una enfermedad infecciosa.`
		}),
		()=>0,
		function() {
			diagram.show("I_to_D");
		}),
	
	new Slide(L({
			en: `The SIR model can be extended by taking into account the people who <span class="D"><i>Died</i> (D)</span> after the <span class="I">infection</span>.`,
			fr: `Le mod??le SIR peut ??tre ??tendu pour prendre en compte les personnes <span class="D"><i>D??c??d??es</i> (D)</span> suite ?? l'<span class="I">infection</span>.`,
			es: `El modelo SIR puede ampliarse para tener en cuenta a las personas que<br><span class="D"><i>Fallecieron</i> (D para Deceased)</span> despu??s de la <span class="I">infecci??n</span>.`
		}),
		function() {
			diagram.show("D");
		},
		function() {
			diagram.show("R_to_S");
		},
		()=>0,
		function() {
			diagram.hide("D");
			diagram.hide("I_to_D");
		}),
	
	new Slide(L({
			en: `Furthermore, if acquired immunity is not permanent, <span class="R">Recovered</span> people can become <span class="S">Susceptible</span> again.`,
			fr: `De plus, si l'immunit?? acquise n'est pas permanente, les personnes <span class="R">R??tablies</span> peuvent redevenir <span class="S">Susceptibles</span>.`,
			es: `Adem??s, si la inmunidad adquirida no es permanente, las personas <span class="R">Restablecidas</span> pueden volver a ser <span class="S">Susceptibles</span>.`
		}),
		()=>0,
		function() {
			$("diagram").style.opacity = 0;
			graph1.move(15, 20, 60, 60);
		},
		function() {
			$("diagram").style.opacity = 1;
		},
		function() {
			diagram.hide("R_to_S");
		}),
	
	new Slide(L({
			en: `The number of people in each state can be represented in a graph for every day following the initial infection.`,
			fr: `Le nombre de personnes dans chaque ??tat peut ??tre repr??sent?? dans un graphique pour chaque jour suivant l'infection initiale.`,
			es: `Se puede representar en un gr??fico el n??mero de personas en cada situaci??n cada d??a tras la infecc??on inicial.`
		}),
		function() {
			sliders.timeEnd.update(10);
			
			initialContamination = 0.01;
			contactsPerDay = 10;
			probInfection = 0.04;
			daysInfectious = 28;
			daysImmunity = Infinity;
			mortality = 0.1;
			hospitalCapacity = 0;
			isolationStart = Infinity;
			vaccineDay = Infinity;
			
			simulate();
			
			graph1.update();
			graph1.plotAll();
			graph1.show();
		},
		()=>0,
		()=>0,
		function() {
			graph1.hide();
		}),
	
	new Slide(L({
			en: `The amounts are given as percentages of the full population. Here, 1% of the population is initially <span class="I">Infected</span>.`,
			fr: `Les quantit??s sont donn??es comme pourcentages de la population totale. Ici, 1% de la population est initialement <span class="I">Infect??e</span>.`,
			es: `Las cantidades se dan como porcentajes de la poblaci??n total. Aqu?? hay 1% de la poblaci??n que esta inicialmente <span class="I">Infectada</span>.`
		})),
	
	new Slide(L({
			en: `On the far right of the graph, the values for the final shown day are indicated.`,
			fr: `?? l'extr??me droite du graphique sont indiqu??es les valeurs pour le dernier jour affich??.`,
			es: `Al extremo derecho del gr??fico estan indicados los valores para el ultimo d??a mostrado.`
		}),
		()=>0,
		function () {
			graph1.move(25, 8, 40, 40);
			graph2.move(25, 52, 40, 40);
		},
		function() {
			graph1.move(15, 20, 60, 60);
		},),
	
	new Slide(L({
			en: `Let???s also show the number of <i>new cases per day</i>. Each day, a percentage of the population gets <span class="I">infected</span>, <span class="R">recover</span>, or <span class="D">die</span>. This is a typical graph given when trying to monitor the evolution of a disease.`,
			fr: `Montrons aussi le nombre de <i>nouveaux cas par jour</i>. Chaque jour, un pourcentage de la population devient <span class="I">infect??e</span>, se <span class="R">r??tablit</span>, ou <span class="D">d??c??de</span>. C'est un graphique typique pour repr??senter l'??volution d'une maladie.`,
			es: `Mostremos tambi??n el n??mero de <i>nuevos casos por d??a</i>. Cada d??a, un porcentaje de la poblaci??n se <span class="I">infecta</span>, se <span class="R">restablece</span>, o <span class="D">fallece</span>. Es un gr??fico t??pico para representar la evoluci??n de una enfermedad.`
		}),
		function() {
			graph2.update();
			graph2.plotAll();
			graph2.show();
		},
		()=>0,
		()=>0,
		function() {
			graph2.hide();
		}),
	
	new Slide(L({
			en: `Beware! The graphs here show the <u>actual</u> number of cases. In real life, not all <span class="I">Infected</span> people get tested and recorded. Even when they are, it is not immediatly at the moment they became contagious. Therefore, real statistics are <u>delayed</u> and <u>underestimate the numbers</u>.`,
			fr: `Prenez garde ! Les graphiques montr??s ici donnent le <u>v??ritable</u> nombre de cas. Dans la vie r??elle, les personnes <span class="I">Infect??es</span> ne sont pas toutes rep??r??es et enregistr??es. M??me lorsqu'elles le sont, c'est en g??n??ral quelques jours apr??s qu'elles soient devenues contagieuses. Les statistiques r??elles sont donc <u>en retard</u> et <u>sous-estiment</u> les nombres.`,
			es: `??Cuididado! Los gr??ficos aqu?? muestran el n??mero <u>actual</u> de casos. En la vida real, no todas las personas <span class="I">Infectadas</span> llegan a ser detectadas y registradas, y las pruebas no son immediatas en cuanto un caso aparezca. Por lo tanto, las estad??sticas reales tienen <u>retraso</u> y <u>subestimadan</u> las cifras.`
		})),
	
	new Slide(L({
			en: `The evolution of the number of <span class="I">Infected</span> people follows what is called an <i>exponential growth</i>. It means that <u>the number of <span class="I">new cases</span> per day is proportional to the number of <span class="I">current cases</span></u>. <span class="I">Infection</span> is more likely when there are more <span class="I">Infected</span> people around.`,
			fr: `L'??volution du nombre de personnes <span class="I">Infect??es</span> suit ce qu'on appelle une <i>croissance exponentielle</i>. Cela signifie que <u>le nombre de <span class="I">nouveaux cas</span> par jour est proportionnel au nombre de <span class="I">cas pr??sents</span></u>. L'<span class="I">infection</span> est plus probable lorsqu'il y a plus de personnes <span class="I">Infect??es</span> environnantes.`,
			es: `La evoluci??n de la cantidad de personas <span class="I">Infectadas</span> sigue lo que se llama un <i>crecimiento exponencial</i>. Esto significa que <u>la cantidad de <span class="I">nuevos casos</span> por d??a es proporcional a la cantidad de <span class="I">casos presentes</span></u>. El <span class="I">contagio</span> es m??s probable cuando hay m??s personas <span class="I">Infectadas</span> alrededor.`
		})),
	
	new Slide(L({
			en: `When the number of <span class="I"><i>current</i> cases</span> increases, the number of <span class="I"><i>new</i> appearing cases</span> also increases, and vice versa. It seems like it will never stop! But let's look a bit further in time...`,
			fr: `Quand le nombre <span class="I"><i>actuel</i> de cas</span> augmente, le nombre de <span class="I"><i>nouveaux</i> cas</span> augmente aussi, et vice versa. On dirait que cela ne s'arr??tera jamais ! Mais regardons un peu plus loin dans le futur...`,
			es: `Cuando la cantidad <span class="I"><i>actual</i> de casos </span> aumenta,la cantidad de <span class="I"><i>nuevos</i> casos</span> aumenta tambi??n, y viceversa. ??Parece que nunca se detendr??! Pero miremos un poco m??s adelante en el futuro...`
		}),
		()=>0,
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			
			sliders.timeEnd.animTo(45, true, true, false);
		},
		function() {
			hideSliders();
		}),
	
	new Slide(L({
			en: `Actually, <u>the number of <span class="I">new cases</span> is also proportional to the number of remaining <span class="S">Susceptible</span> people</u>, so it reaches a maximum value when this number gets too low (see the peak in the right graph).`,
			fr: `En r??alit??, <u>le nombre de <span class="I">nouveaux cas</span> est aussi proportionnel au nombre de personnes <span class="S">Susceptibles</span> restantes</u>, un maximum est donc atteint lorsque ce nombre devient trop petit (voir le pic dans le graphique de droite).`,
			es: `En realidad, <u>la cantidad de <span class="I">nuevos casos</span> esta tambi??n proporcional a la cantidad de personas <span class="S">Susceptibles</span> que quedan</u>, por ello se alcanza un punto m??ximo cuando esta cantidad se pone demasiado peque??a (ver el punto m??ximo en el gr??fico de la derecha).`
		}),
		function() {
			selectVisibleSliders({
				timeEnd: true
			});
		},
		()=>0,
		()=>0,
		function() {
			sliders.timeEnd.animTo(10, true, true, false);
			sliders.timeEnd.hide();
		}),
	
	new Slide(L({
			en: `Thank to this, the maximum recorded number of <span class="I">Infected</span> people stays below 100%. Play with the cursor to see how the epidemic settles out.`,
			fr: `Gr??ce ?? cela, le nombre maximum de personnes <span class="I">Infect??es</span> reste en dessous 100%. D??placez le curseur pour observer la stabilisation de l'??pid??mie.`,
			es: `Gracias a esto, la cantidad m??xima de personas <span class="I">Infectadas</span> permanece bajo 100%. Mueva el cursor y vea c??mo la epidemia se estabiliza.`
		})),
	
	new Slide(L({
			en: `Do you see the <span class="I">red bell-shaped curve</span> on the left graph of current cases? This is <i>the Curve</i> we have to flatten! Take a look at the next chapters to learn <i>How</i> to do it and <i>Why</i> we have to.`,
			fr: `Voyez-vous la <span class="I">courbe rouge en cloche</span> sur le graphique de gauche des cas pr??sents ? Il s'agit de <i>la Courbe</i> que nous devons aplatir ! Explorez les prochains chapitres pour apprendre <i>Comment</i> et <i>Pourquoi</i> nous devons faire cela.`,
			es: `??Ve a la <span class="I">curva campaniforme</span> en el gr??fico de la izquierda de los casos actuales? Se trata de <i>la Curva</i> que tenemos que aplanar! Explore los proximos cap??tulos para aprender <i>C??mo</i> y <i>Porqu??</i> tenemos que hacerlo.`
		}))
];


var slidesHow = [
	new Slide(L({
			en: `Let's go back to our graph of current cases per day.`,
			fr: `Retournons ?? notre graphique des cas pr??sents.`,
			es: `Volvamos a nuestro gr??fico de los casos presentes.`
		}),
		function() {
			$("mainText").style.left = "5%";
			$("mainText").style.bottom = "5%";
			graph1.move(15, 20, 60, 60);
			
			sliders.timeEnd.             update(180);
			sliders.initialContamination.update(-2);   // 1%
			sliders.contactsPerDay.      update(10);
			sliders.probInfection.       update(0.2);   // 4%
			sliders.daysInfectious.      update(10);
			sliders.daysImmunity.        update(366);   // forever
			sliders.mortality.           update(0.316); // 10%
			
			sliders.isolationStart.         update(366);   // never
			sliders.isolationDuration.      update(366);   // forever
			sliders.contactsPerDayIsolation.update(3);
			sliders.vaccineDay.             update(731);   // never
			
			hospitalCapacity = 0;
			
			simulate();
			
			graph1.update();
			graph1.plotAll();
			graph1.show();
			
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
		}),
	
	new Slide(L({
			en: `We recall that our aim is to reduce the height of the <span class="I">red curve</span>, showing the number of <span class="I">Infected</span> people per day.`,
			fr: `Rappelons notre but : r??duire la hauteur de la <span class="I">courbe rouge</span>, repr??sentant pour chaque jour le nombre de personnes <span class="I">Infect??es</span>.`,
			es: `Recordemos nuestro objetivo : aplanar la altura de la <span class="I">curva roja</span> que representa la quantidad de personas <span class="I">Infectadas</span>.`
		}),
		()=>0,
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			graph1.move(5, 20, 60, 60);
		},
		function() {
			hideSliders();
			graph1.move(15, 20, 60, 60);
		}),
	
	new Slide(L({
			en: `Many parameters influence <i>the Curve</i>. Let's take a look at a first one: the average <i>infection duration</i>.`,
			fr: `De nombreux param??tres influencent <i>la Courbe</i>. Explorons un premier param??tre : la <i>dur??e d'infection</i> moyenne.`,
			es: `Muchos par??metros influyen en <i>la Curva</i>. Exploremos un primer par??metro: la <i>duraci??n de infecci??n</i> media.`
		}),
		function() {
			sliders.daysInfectious.show();
		},
		function() {
			sliders.daysInfectious.animTo(28);
		},
		()=>0,
		function() {
			selectVisibleSliders({});
		}),
	
	new Slide(L({
			en: `See how greatly the height of <i>the Curve</i> is influenced by this parameter. When the people are <span class="I">ill</span> for longer, they have a higher chance of <span class="I">spreading the disease</span>.`,
			fr: `Vous pouvez constater la grande influence de ce param??tre sur la hauteur de <i>la Courbe</i>. Lorsqu'une personne est <span class="I">malade</span> plus longtemps, elle a plus de chance de <span class="I">transmettre la maladie</span>.`,
			es: `Se puede ver que este par??metro tiene una gran influencia sobre la altura de <i>la Curva</i>. Cuando una persona est?? <span class="I">enferma</span> mientras m??s tiempo, es m??s probable que <span class="I">transmita la enfermedad</span>.`
		}),
		()=>0,
		function() {
			sliders.daysInfectious.hide();
			sliders.daysInfectious.animTo(10);
		},
		function() {
			sliders.daysInfectious.show();
		},
		function() {
			sliders.daysInfectious.animTo(10);
		}),
	
	new Slide(L({
			en: `Another parameter can influence <i>the Curve</i>. It is the <i>duration of the immune period</i>, which is not necesarily permanent.`,
			fr: `Un autre param??tre pouvant influencer <i>la Courbe</i> est la <i>dur??e de la p??riode immune</i>, qui n'est pas forc??ment permanente.`,
			es: `Otro par??metro que puede influir <i>la Curva</i> es la <i>duraci??n del per??odo inmune</i>, que no es necesariamente permanente.`
		}),
		function() {
			sliders.daysImmunity.show();
		},
		function() {
			sliders.daysImmunity.animTo(310);
		},
		()=>0,
		function() {
			sliders.daysImmunity.hide();
			sliders.daysInfectious.animTo(28);
		}),
	
	new Slide(L({
			en: `When the immune period is shorter, poeple who were <span class="R">Recovered</span> become <span class="S">Susceptible</span> again.`,
			fr: `Lorsque la p??riode immune est plus courte, les personnes <span class="R">R??tablies</span> peuvent redevenir <span class="S">Susceptibles</span>.`,
			es: `Cuando el per??odo inmune es m??s corto, las personas <span class="R">Restablecidas</span> pueden volver a ser <span class="S">Susceptibles</span>.`
		}),
		()=>0,
		function() {
			sliders.daysImmunity.animTo(10);
		},
		()=>0,
		function() {
			sliders.daysInfectious.animTo(10, false);
			sliders.daysImmunity.animTo(366);
		}),
	
	new Slide(L({
			en: `And even shorter, the <span class="S">Susceptible</span> people become <span class="I">Infected</span> again, slowing down the decrease of <i>the Curve</i>, causing more <span class="D">deaths</span>.`,
			fr: `Et plus courte encore : les personnes <span class="S">Susceptibles</span> redeviennent <span class="I">Infect??es</span>, ralentissant la d??croissance de <i>la Courbe</i> et causant plus de <span class="D">d??c??s</span>.`,
			es: `Y a??n m??s corto: las personas <span class="S">Susceptibles</span> se ponen <span class="I">Infectadas</span> de nuevo, frenando el decrecimiento de <i>la Curva</i> y causando m??s <span class="D">fallecimientos</span>.`
		}),
		()=>0,
		function() {
			graph1.move(25, 8, 40, 40);
			graph3.move(25, 52, 40, 40);
			sliders.daysImmunity.animTo(62);
		},
		function() {
			graph1.move(5, 20, 60, 60);
		},
		function() {
			sliders.daysImmunity.animTo(310);
		}),
	
	new Slide(L({
			en: `Another effect can be revealed by showing the <i>number of total recorded cases</i> up to a given day: people get <span class="I">ill</span> more than one time, and the number of <span class="I">total recorded infections</span> overshoots 100%! This is why we observe more <span class="D">deaths</span>.`,
			fr: `Un autre effet peut ??tre mis en avant en montrant le <i>nombre total de cas</i> enregistr??s jusqu'?? un certain jour : certaines personnes <span class="I">tombent malades</span> plus d'une fois, et le <span class="I">nombre total d'infections</span> enregistr??es d??passe les 100% ! C'est la raison pour laquelle il y a plus de <span class="D">d??c??s</span>.`,
			es: `Un otro efecto puede ser destacado mostrando la quantidad de casos registrados hasta un d??a determinado: algunas personas se ponen <span class="I">enfermas</span> m??s de una vez, y ??la <span class="I">quantidad total de casos</span> registrados supera  el 100%! Es la raz??n por la cual hay m??s <span class="D">fallecimientos</span>.`
		}),
		function() {
			graph3.update();
			graph3.plotAll();
			graph3.show();
		},
		function() {
			sliders.daysImmunity.animTo(180);
			sliders.daysImmunity.hide();
		},
		function() {
			sliders.daysImmunity.show();
		},
		function() {
			graph3.hide()
			sliders.daysImmunity.animTo(10);
		}),
	
	new Slide(L({
			en: `A third parameter is the <i>lethality</i> of the disease, distinguishing between the chances of <span class="R">recovery</span> and <span class="D">death</span> after an <span class="I">infection</span>. This parameter has a greater impact on the number of <span class="D">deaths</span> than on the height of <i>the Curve</i> itself.`,
			fr: `Regardons un troisi??me param??tre : la <i>l??talit??</i> de la maladie, donnant les chances de <span class="R">r??tablissement</span> et de <span class="D">d??c??s</span> suite ?? une <span class="I">infection</span>. Ce param??tre a plus d'impact sur le nombre de <span class="D">d??c??s</span> que sur la hauteur de <i>la Courbe</i> elle-m??me.`,
			es: `Un tercero par??metro es la <i>letalidad</i> de la enfermedad, distinguiendo las probabilidades de <span class="R">recuperaci??n</span> o de <span class="D">fallecimiento</span> despu??s una <span class="I">infecci??n</span>. Este par??metro tiene m??s repercusiones en la cantidad de <span class="D">fallecimientos</span> que en la altura de <i>la Curva</i> propiamente dicho.`
		}),
		function() {
			sliders.mortality.show();
		},
		function() {
			sliders.mortality.animTo(0.316);
			sliders.mortality.hide();
		},
		function() {
			sliders.mortality.show();
		},
		function() {
			sliders.mortality.hide();
			sliders.mortality.animTo(0.316, false);
			sliders.daysImmunity.animTo(62);
		}),
	
	new Slide(L({
			en: 'All the parameters enumerated until then are unfortunately not easily within our grasp. Their value is more or less fixed for a given disease.',
			fr: `Il est malheureusement difficile pour nous d'avoir une influence sur les param??tres ??nonc??s jusqu'ici. Leur valeur est plus ou moins fixe pour une maladie donn??e.`,
			es: `Infortunadamente, es dif??cil para nosotros de tener una influencia sobre los par??metros enunciados previamente. Su valor es m??s o menos fijo para una enfermedad determinada.`
		}),
		()=>0,
		()=>0,
		()=>0,
		()=>0,),
	
	new Slide(L({
			en: `There are still other parameters on which everyone can have an influence.`,
			fr: `Il y a toutefois d'autres param??tres sur lesquels tout le monde peut avoir une influence.`,
			es: `Sin embargo, existen otros par??metros sobre los cuales todo el mundo puede tener influencia.`
		}),
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(L({
			en: `The <i>number of contacts per day</i> is average number of people one invidual gets in close contact with in one day (handshake, prolonged proximity, etc.).`,
			fr: `Le <i>nombre de contacts par jour</i> est le nombre moyen de contacts rapproch??s qu'un individu peut avoir avec d'autres personnes en une journ??e (poign??e de main, proximit?? prolong??e, etc.).`,
			es: `La <i>cantidad de contactos por d??a</i> es el promedio de los contactos cercanos que un individuo puede tener con otras personas en un d??a (apret??n de manos, proximidad prolongada, etc.).`
		}),
		function() {
			sliders.contactsPerDay.show();
			sliders.probInfection.show();
		},
		()=>0,
		()=>0,
		function() {
			sliders.contactsPerDay.hide();
			sliders.probInfection.hide();
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2); // 4%
		}),
	
	new Slide(L({
			en: `The <i>infection probability</i> is the probability that a <span class="S">Susceptible</span> person gets <span class="I">infected</span> when it gets into close contact with an <span class="I">Infected</span> person.`,
			fr: `La <i>probabilit?? d'infection</i> est la probabilit?? qu'une personne <span class="S">Susceptible</span> soit <span class="I">infect??e</span> suite ?? un contact rapproch?? avec une personne <span class="I">Infect??e</span>.`,
			es: `La <i>probabilidad de infecci??n</i> es la probabilidad que una persona <span class="S">Susceptible</span> est?? <span class="I">infectada</span> despu??s de un contacto cercano con una persona <span class="I">Infectada</span>.`
		}),
		()=>0,
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(L({
			en: `We can define an important number called the <i>basic reproduction number</i> R<sub>0</sub>, which is the product between the number of contacts per days, the infection probability, and the infection duration.`,
			fr: `Nous pouvons d??finir un nombre important, appel?? le <i>taux de reproduction de base</i> R<sub>0</sub>, comme ??tant le produit entre le nombre de contacts par jour, la probabilit?? d'infection et la dur??e d'infection.`,
			es: `Podemos definir un n??mero importante, llamado <i>n??mero b??sico de reproducci??n</i> R<sub>0</sub>, como el producto entre la cantidad de contactos por d??a, la probabilidad de infecci??n y la duraci??n de la infecci??n.`
		}),
		()=>0,
		function() {
			sliders.timeEnd.animTo(730);
		},
		()=>0,
		()=>0),
	
	new Slide(L({
			en: `<u>An epidemic outbreak is possible when R<sub>0</sub> is greater than 1</u>.<br>Here, R<sub>0</sub> = `,
			fr: `<u>Une ??pid??mie peut se propager lorsque R<sub>0</sub> est plus grand que 1</u>.<br>Ici, R<sub>0</sub> = `,
			es: `<u>Una epidemia puede propagarse cuando R<sub>0</sub> esta mas grande que 1</u>.<br>Aqui, R<sub>0</sub> = `
		}),
		function() {
			addR0indicator();
			$("mainText").append(document.createElement("br"));
			$("mainText").append(L({
				en: `Play with the sliders to verify this theory!`,
				fr: `D??placez les curseurs pour v??rifier cette th??orie !`,
				es: `??Mueva el cursor para verificar esta teor??a!`
			}));
		},
		function() {
			removeR0indicator();
		},
		function() {
			addR0indicator();
			$("mainText").append(document.createElement("br"));
			$("mainText").append(L({
				en: `Play with the sliders to verify this theory!`,
				fr: `D??placez les curseurs pour v??rifier cette th??orie !`,
				es: `??Mueva el cursor para verificar esta teor??a!`
			}));
		},
		function() {
			removeR0indicator();
			sliders.timeEnd.animTo(180);
		}),
	
	new Slide(L({
			en: `Did you see how the total number of <span class="I">infections</span> can skyrocket? The message is simple: in case of epidemic or pandemic, <u>keep R<sub>0</sub> low</u>.`,
			fr: `Avez-vous constat?? comme le nombre d'<span class="I">infections</span> peut exploser ? Le message est clair : en cas d'??pid??mie ou de pand??mie, <u>maintenez R<sub>0</sub> au plus bas</u>.`,
			es: `??Ha visto como la cantidad de <span class="I">infecci??nes</span> puede explotar? El mensaje es claro: en caso de epidemia o pandemia, <u>mantenga R<sub>0</sub> por los suelos</u>.`
		}),
		()=>0,
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(L({
			en: `Minimize the number of close contacts per day by <u>maintaining a safe distance of two meters</u> between you and the others and by <u>staying at home</u>.`,
			fr: `Minimisez le nombre de contacts rapproch??s quotidiens en <u>maintenant une distance de s??curit?? de deux m??tres</u> entre vous-m??me et les autres et en <u>restant ?? la maison</u>.`,
			es: `Minimice la cantidad de contactos cercanos diarios <u>manteniendo una distancia de seguridad</u> entre s?? mismo y los otros y <u>qued??ndose en casa</u>.`
		}),
		function() {
			sliders.contactsPerDay.animTo(3);
		},
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(L({
			en: `Minimize the probability of infection by <u>coughing in your elbow</u>, <u>washing your hands</u> and <u>not touching your face</u>.`,
			fr: `Minimisez la probabilit?? d'infection en <u>toussant dans votre coude</u>, en <u>lavant vos mains</u> et en <u>??vitant de toucher votre visage</u>.`,
			es: `Minimice la probabilidad de infecci??n <u>tosiendo en su codo</u>, <u>lav??ndose las manos</u> y <u>absteni??nose de tocarse la cara</u>.`
		}),
		function() {
			sliders.probInfection.animTo(0.022);
		},
		function() {
			sliders.contactsPerDay.hide();
			sliders.probInfection.hide();
			sliders.timeEnd.animTo(180, false);
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2);
			
			graph3.hide();
		},
		function() {
			graph3.show();
			
			sliders.contactsPerDay.show();
			sliders.probInfection.show();
		},
		function() {
			sliders.contactsPerDay.animTo(3);
		}),
	
	new Slide(L({
			en: `Aside from individual efforts, <i>global initiatives</i> can also be engaged to combat the high <i>Curve</i>.`,
			fr: `?? c??t?? des mesures individuelles, des <i>initiatives globales</i> peuvent ??tre prises pour combattre la hauteur de <i>la Courbe<i>.`,
			es: `Al margen de las medidas individuales, <i>iniciativas globales</i> pueden adoptarse para luchar contra la altesa de <i>la Curva</i>.`
		}),
		function() {
			graph1.move(15, 20, 60, 60);
			sliders.isolationStart.animTo(180, false); // hidden, but prettier animations for after
		},
		function() {
			graph1.move(5, 20, 60, 60);
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(180, false); // hidden
			sliders.vaccineDay.animTo(180); // hidden
		},
		function() {
			graph1.move(15, 20, 60, 60);
		},
		function() {
			graph1.move(25, 8, 40, 40);
			
			sliders.timeEnd.animTo(730, false);
			sliders.probInfection.animTo(0.022);
		}),
	
	new Slide(L({
			en: `For example, people can be asked to <i>isolate themselves by staying at home</i> and therefore being in contact with less other persons. You can see how <i>the Curve</i> deflates starting from the first day of isolation.`,
			fr: `Par exemple, les gens peuvent ??tre appel??s ?? <i>s'isoler en restant chez eux</i>, diminuant ainsi leurs contacts avec d'autres personnes. Vous pouvez constater la r??duction de <i>la Courbe</i> d??s le premier jour de confinement.`,
			es: `Por ejemplo, los ciudadanos pueden ser llamados a <i>aislarse permaneciendo en casa</i>, disminuyendo as?? sus contactos con otras personas. Puede observar la disminuci??n de <i>la Curva</i> desde el primer d??a de aislamiento.`
		}),
		function() {
			selectVisibleSliders({
				isolationStart: true,
				contactsPerDayIsolation: true
			});
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.isolationStart.animTo(366, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),
	
	new Slide(L({
			en: `Of course, people cannot be asked to stay locked down at home forever, so the isolation period has to be temporary.`,
			fr: `De toute ??vidence, les gens ne peuvent pas ??tre forc??s ?? rester ??ternellement chez eux. La p??riode de confinement doit donc ??tre temporaire.`,
			es: `Por supuesto, la gente no puede ser forzada a quedarse eternamente en su casa. El per??odo de aislamiento debe ser temporaria.`
		}),
		()=>0,
		function() {
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(62, false);
			sliders.contactsPerDayIsolation.animTo(3);
			selectVisibleSliders({});
		},
		function() {
			selectVisibleSliders({
				isolationStart: true,
				contactsPerDayIsolation: true
			});
		},
		()=>0),
	
	new Slide(L({
			en: `Ouch, after the isolation period, a new outbreak appears, maybe because the population cannot build an immunity against the disease during the confinement!`,
			fr: `A??e, suite ?? la p??riode de confinement, l'??pid??mie red??marre, peut-??tre parce que la population n'a pas pu s'immuniser contre la maladie durant le confinement !`,
			es: `??Ay, depu??s del per??odo de aislamiento vuelve a arrancar la epidemia, quiz??s porque la poblaci??n no pudo inmunizarse mientras el aislamiento!`
		}),
		function() {
			selectVisibleSliders({
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(180, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),
	
	new Slide(L({
			en: `Anyway, the isolation period can be placed to maximally flatten the bumps of <i>the Curve</i>, which is the best we can do for now.`,
			fr: `Quoiqu'il en soit, la p??riode de confinement peut ??tre plac??e pour aplatir le plus possible les bosses de <i>la Courbe</i>, ce qui est le mieux que l'on puisse faire pour le moment.`,
			es: `De todos modos, el per??odo de aislamiento puede ser establecido para aplanar al m??ximo los bachos de <i>la Curva</i>, lo que es lo mejor que podemos hacer por ahora.`
		}),
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.isolationStart.animTo(180, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.vaccineDay.animTo(8);
		},
		function() {
			selectVisibleSliders({
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
		},
		function() {
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(62, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),
	
	new Slide(L({
			en: `The final <i>Curve</i> flattening global initiative presented in this chapter is the introduction of a <i>vaccine</i>, which turns all the current <span class="S">Susceptible</span> people into <span class="R">immunised</span> persons (in reality, not everyone would get vaccinated).`,
			fr: `La derni??re initiative globale d'aplatissement de <i>Courbe</i> pr??sent??e dans ce chapitre est l'introduction d'un <i>vaccin</i>, qui donne l'<span class="R">immunit??</span> ?? toutes les personnes <span class="S">Susceptibles</span> pr??sentes (en r??alit??, tout le monde ne serait pas vaccin??).`,
			es: `La ultima iniciativa global para aplanar <i>la Curva</i> presentada en este cap??tulo es la introducci??n de una <i>vacuna</i>, que <span class="R">inmuniza</span> todas las personas <span class="S">Susceptibles</span> presentes (en realidad, no todo el mundo ser??a vacunado).`
		}),
		function() {
			sliders.vaccineDay.show();
		},
		()=>0,
		()=>0,
		function() {
			sliders.vaccineDay.hide();
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(62, false);
			sliders.contactsPerDayIsolation.animTo(3, false);
			sliders.vaccineDay.animTo(731);
		}),
	
	new Slide(L({
			en: `You can see as well how <i>the Curve</i> gets flattened. Unfortunately, vaccines are generally slow to develop and to implement into the population.`,
			fr: `Vous pouvez voir que <i>la Courbe</i> s'aplatit aussi. Malheureusement, les vaccins prennent en g??n??ral du temps ?? ??tre d??velopp??s puis ?? ??tre distribu??s ?? la population.`,
			es: `Puede ver que <i>la Curva</i> tambi??n se aplana. Infortunadamente, las vacunas toman tiempo en ser desarolladas y distribuidas a la poblaci??n.`
		}),
		()=>0,
		function() {
			sliders.vaccineDay.hide();
			setTimeout(function() { moveSliders(60); }, TRANSITION_DURATION / 2);
			sliders.isolationStart.animTo(366, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.vaccineDay.animTo(731);
			graph1.move(12, 8, 40, 40);
			graph3.move(12, 52, 40, 40);
		},
		function() {
			graph1.move(5, 20, 60, 60);
			graph3.move(25, 52, 40, 40);
			sliders.vaccineDay.show();
		},
		()=>0),
	
	new Slide(L({
			en: `This chapter ends here. You can now play with all the accessible paramaters. Do your best to flatten <i>the Curve</i>! The next chapter will explain <i>Why</i> this flattening is so important.`,
			fr: `Ce chapitre se termine ici. Vous pouvez ?? pr??sent jouer avec tous les param??tres accessibles. Fa??tes de votre mieux pour aplatir <i>la Courbe</i> ! Le prochain chapitre expliquera <i>Pourquoi</i> cet aplatissement est si important.`,
			es: `Este cap??tulo se termina aqu??. Pueden ahora jugar con todos los par??metros accesibles. ??Intente hacer lo mejor que pueda para aplanar <i>la Curva</i>! El pr??ximo cap??tulo explicar?? <i>Porqu??</i> este aplanamiento es tan importante.`
		}),
		function() {
			graph3.update();
			graph3.plotAll();
			graph3.show();
			
			selectVisibleSliders({
				timeEnd:                 true,
				contactsPerDay:          true,
				probInfection:           true,
				isolationStart:          true,
				isolationDuration:       true,
				vaccineDay:              true,
				contactsPerDayIsolation: true
			})
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			setTimeout(function() { moveSliders(70); }, TRANSITION_DURATION / 2);
			graph3.hide();
			
			sliders.timeEnd.animTo(180, false);
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2, false);
			sliders.isolationStart.animTo(366, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.contactsPerDayIsolation.animTo(3, false);
			sliders.vaccineDay.animTo(8);
		}),
];


var slidesWhy = [
	new Slide(L({
			en: `In the previous chapters, you learned what the <span class="I">Infection</span> <i>Curve</i> is and several ways to flatten it. You may be wondering <i>Why</i> this is desirable?`,
			fr: `Dans les chapitres pr??c??dents, vous avez appris ce qu'est <i>la Courbe</i> des <span class="I">Infections</span> et plusieurs moyens de l'aplatir. Vous devez vous demander <i>Pourquoi</i> cela est n??cessaire ?`,
			es: `En los cap??tulos previos, ha aprendido qu?? es que <i>la Curva</i> de las <span class="I">Infecci??nes</span> y varias formas de aplanarla. Debe preguntarse ??<i>Porqu??</i> es necesario?`
		}),
		function() {
			$("mainText").style.left = "5%";
			$("mainText").style.bottom = L({en: "45%", fr: "47%"});
			graph1.move(15, 20, 60, 60);
			
			sliders.timeEnd.             update(180);
			sliders.initialContamination.update(-2);   // 1%
			sliders.contactsPerDay.      update(10);
			sliders.probInfection.       update(0.2);   // 4%
			sliders.daysInfectious.      update(10);
			sliders.daysImmunity.        update(180);
			sliders.mortality.           update(0.316); // 10%
			
			sliders.isolationStart.         update(366);   // never
			sliders.isolationDuration.      update(366);   // forever
			sliders.contactsPerDayIsolation.update(3);
			sliders.vaccineDay.             update(731);   // never
			
			sliders.daysBeforeHospital.update(4);
			sliders.hospitalCapacity.  update(0);
			sliders.mortalityHospital. update(0.141); // 2%
			
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
		},
		()=>0,
		function() {
			$("mainText").style.bottom = L({en: "45%", fr: "47%"});
		}),

	new Slide(L({
			en: `The answer is: <span class="H"><i>Hospitals</i></span>!<br>Let's see how they are implemented in our model.`,
			fr: `La r??ponse est : les <span class="H"><i>H??pitaux</i></span> !<br>Voyons comment ils sont impl??ment??s dans notre mod??le.`,
			es: `La respuesta es: ??<span class="H"><i>Hospitales</i></span>!<br>Veamos c??mo est??n implementados en nuesto modelo.`
		}),
		function() {
			$("mainText").style.bottom = "46%";
		},
		function() {
			diagram.reset();
			
			diagram.nodes.S.developped = 1;
			diagram.nodes.I.developped = 1;
			diagram.nodes.R.developped = 1;
			diagram.nodes.D.developped = 1;
			diagram.arrows.S_to_I.developped = 1;
			diagram.arrows.I_to_R.developped = 1;
			diagram.arrows.I_to_D.developped = 1;
			diagram.arrows.R_to_S.developped = 1;
			
			diagram.draw();
		},
		function() {
			$("mainText").style.bottom = "46%";
		},
		()=>0),
	
	new Slide(L({
			en: `<span class="I">Infected</span> can now be sent to the <span class="H">Hospital</span> where they are <i>separated</i> from the rest of the population, so that they do not contribute to the creation of <span class="I">new cases</span>.`,
			fr: `Les personnes <span class="I">Infect??es</span> peuvent maintenant ??tre envoy??es ?? l'<span class="H">H??pital</span> o?? elles seront <i>s??par??es</i> du reste de la population, et ne pourront donc plus contribuer ?? la cr??ation de <span class="I">nouveaux cas</span>.`,
			es: `Ahora, las personas <span class="I">Infectadas</span> pueden ir al <span class="H">Hospital</span> donde estar??n <i>separadas</i> del resto de la poblaci??n, as?? no podr??n contribuir a la generaci??n de <span class="I">nuevos casos</span>.`
		}),
		function () {
			$("mainText").style.bottom = "5%";
			$("diagram").style.opacity = 1;
			
			setTimeout(function() {
				diagram.show("I_to_H");
			}, TRANSITION_DURATION * 1000);
			
			setTimeout(function() {
				diagram.show("H");
			}, 2 * TRANSITION_DURATION * 1000);
		},
		function() {
			diagram.show("H_to_R");
			diagram.show("H_to_D");
		},
		()=>0,
		function() {
			diagram.hide("I_to_H");
			diagram.hide("H");
			$("diagram").style.opacity = 0;
		}),

	new Slide(L({
			en: `After their stay at the <span class="H">Hospital</span>, people can also <span class="R">Recover</span> or <span class="D">Die</span>, usually with a higher chance of <span class="R">recovery</span> than the <span class="I">Infected</span> people not in <span class="H">Hospital</span>.`,
			fr: `Apr??s leur s??jour ?? l'<span class="H">H??pital</span>, les personnes sont <span class="R">R??tablies</span> ou <span class="D">D??c??dent</span>, en g??n??ral avec une plus grande chance de <span class="R">r??tablissement</span> que les personnes <span class="I">Infect??es</span> hors de l'<span class="H">H??pital</span>.`,
			es: `Despu??s de su estancia al <span class="H">Hospital</span>, las personas est??n <span class="R">Restablecidas</span> o <span class="D">Fallecen</span>, generalmente con una mayor probabilidad de <span class="R">recuperaci??n</span> que las personas <span class="I">Infectadas</span> fuera del <span class="H">H??pital</span>.`
		}),
		()=>0,
		function() {
			$("diagram").style.opacity = 0;
			
			simulate();
			
			graph1.move(25, 8, 40, 40);
			graph2.move(25, 52, 40, 40);
			
			graph1.update();
			graph1.plotAll();
			
			graph2.update();
			graph2.plotAll();
		},
		function() {
			$("diagram").style.opacity = 1;
		},
		function() {
			diagram.hide("H_to_R");
			diagram.hide("H_to_D");
		}),

	new Slide(L({
			en: `Let's show the current cases and new cases per day, with a fixed <i>Curve</i> height for the moment.`,
			fr: `Montrons le nombre de cas pr??sents et le nombre de nouveaux cas par jour, avec une hauteur de <i>Courbe</i> fixe pour le moment.`,
			es: `Mostremos la cantidad de casos actuales y la cantidad de nuevos casos diarios, con una alteza de <i>Curva</i> fija por el momento.`
		}),
		function() {
			graph1.show()
			graph2.show();
		},
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			
			sliders.hospitalCapacity.animTo(0.2); // 4%
		},
		()=>0,
		function() {
			graph1.hide()
			graph2.hide();
		}),

	new Slide(L({
			en: `Now, we add the <span class="H">Hospitals</span>, which can admit up to a given percentage of the total population (the <i><span class="H">Hospital</span> capacity</i>). You can also control the <i>average number of days</i> between the start of an <span class="I">infection</span> and the admission at a <span class="H">Hospital</span>.`,
			fr: `On ajoute maintenant les <span class="H">H??pitaux</span>, qui peuvent accueillir jusqu'?? un certain pourcentage de la population (la <i>capacit?? des <span class="H">H??pitaux</span></i>). Vous pouvez aussi contr??ler le nombre moyen de jours entre le d??but d'une <span class="I">infection</span> et l'admission ?? l'<span class="H">H??pital</span>.`,
			es: `Ahora a??adimos los <span class="H">Hospitales</span>, que pueden admitir hasta un cierto porcentaje de la poblaci??n (la <i>capacidad de los <span class="H">Hospitales</span></i>). Tambi??n puede controlar el promedio de d??as entre el principio de una <span class="I">infecci??n</span> y el ingreso al <span class="H">Hospital</span>.`
		}),
		function() {
			sliders.daysBeforeHospital.show();
			sliders.hospitalCapacity.show();
		},
		()=>0,
		()=>0,
		function() {
			sliders.daysBeforeHospital.animTo(4, false);
			sliders.hospitalCapacity.animTo(0);
			selectVisibleSliders({});
		}),

	new Slide(L({
			en: `The presence of <span class="H">Hospitals</span> slows down the propagation of the epdemic by separating the <span class="I">Infected</span> people from <span class="S">Susceptibles</span>, as shown by the graph of new cases per day. At least, this is the case when the <span class="H">Hospitals</span> are not full...`,
			fr: `La pr??sence d'<span class="H">H??pitaux</span> ralentit la propagation de l'??pid??mie en s??parant les personnes <span class="I">Infect??es</span> des personnes <span class="S">Susceptibles</span>, comme le montre le graphique des nouveaux cas par jour. Du moins, c'est le cas tant que les <span class="H">H??pitaux</span> ne sont pas pleins...`,
			es: `La presencia de <span class="H">Hospitales</span> frena la propagaci??n de la epidemia, separando las personas <span class="I">Infectadas</span> de las personas <span class="S">Susceptibles</span>, como lo muestra el gr??fico delos nuevos casos por d??a. Al menos, es el caso siempre y cuando los <span class="H">Hospitales</span> no est??n llenos...`
		}),
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.daysBeforeHospital.animTo(4, false);
			sliders.hospitalCapacity.animTo(0.2);
			
			graph1.move(7, 5, 55, 55);
			graph2.move(2, 63, 32, 32);
			graph3.move(35, 63, 32, 32);
		},
		function() {
			sliders.daysBeforeHospital.show();
			sliders.hospitalCapacity.show();
			graph1.move(25, 8, 40, 40);
			graph2.move(25, 52, 40, 40);
		},
		()=>0),

	new Slide(L({
			en: `Playing with the <span class="H">Hospital</span> capacity slider, you will understand that the <u>outbreak suddently occurs when the number of <span class="I">Infected</span> overcomes the <span class="H">Hospital</span> capacity</u>. See how the number of cases suddently change (around 5.3% capacity in this example).`,
			fr: `En jouant avec le curseur de la capacit?? des <span class="H">H??pitaux</span>, vous comprendrez que <u>l'??pid??mie d??marre soudainement lorsque le nombre de personnes <span class="I">Infect??es</span> d??passe la capacit?? des <span class="H">H??pitaux</span></u>. Observez le changement brusque des nombres de cas (autour d'une capacit?? de 5.3% dans cet exemple).`,
			es: `Moviendo el cursor de la capacidad de los <span class="H">Hospitales</span>, comprender?? que <u>la epidemia arranca de repente cuando la cantidad de personnas <span class="I">Infectadas</span> sobrepasa la capacidad de los <span class="H">Hospitales</span></u>. Observe el cambio brusco de la cantidad de casos (alrededor de 5.3% en este ejemplo).`
		}),
		function() {
			sliders.hospitalCapacity.show();
			graph3.update();
			graph3.plotAll();
			graph3.show();
		},
		function() {
			sliders.hospitalCapacity.hide();
			sliders.hospitalCapacity.animTo(0.2);
		},
		()=>0,
		function() {
			sliders.hospitalCapacity.hide();
			graph3.hide();
		}),

	new Slide(L({
			en: `Now that we have <span class="H">Hospitals</span>, test the different actions you have learned about in the previous chapter to flatten <i>the Curve</i>. See how the <span class="D">Death</span> count is affected by the height of <i>the Curve</i> compared to the <span class="H">Hospital</span> capacity.`,
			fr: `Maintenant que nous avons des <span class="H">H??pitaux</span>, testez les diff??rentes actions que vous avez apprises dans le chapitre pr??c??dent pour aplatir <i>la Courbe</i>. Observez la fa??on dont le nombre de <span class="D">D??c??s</span> est affect?? par la hauteur de <i>la Courbe</i> compar??e ?? la capacit?? des <span class="H">H??pitaux</span>.`,
			es: `Ahora que tenemos <span class="H">Hospitales</span>, pruebe las diferentes acciones que aprendieron en el cap??tulo previo para aplanar <i>la Curva</i>. Observa c??mo la cantidad de <span class="D">Fallecimientos</span> se ve afectada por la altesa de la <i>la Curva</i> en comparaci??n con la capacidad de los <span class="H">Hospitales</span>.`
		}),
		()=>0,
		()=>0,
		()=>0,
		function() {
			sliders.hospitalCapacity.show();
		}),

	new Slide(L({
			en: `Start with the number of close contacts per day and the infection probability. <span class="H">Hospitals</span> are great to prevent outbreaks!<br>R<sub>0</sub> = `,
			fr: `Commencez avec le nombre de contacts rapproch??s quotidiens et la probabilit?? d'infection. Les <span class="H">H??pitaux</span> sont tr??s efficaces pour emp??cher les ??pid??mies !<br>R<sub>0</sub> = `,
			es: `Comiene con la cantidad de contactos cercanos diarios y la probabilidad de infecci??n. ??Los <span class="H">Hospitales</span> son muy eficaces para impedir epidemias!<br>R<sub>0</sub> = `
		}),
		function() {
			selectVisibleSliders({
				contactsPerDay: true,
				probInfection: true
			});
			
			addR0indicator();
		},
		function() {
			removeR0indicator();
			
			selectVisibleSliders({});
			sliders.timeEnd.animTo(365, false);
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.245, false); // 6%
			sliders.isolationStart.animTo(180, false);
			sliders.isolationDuration.animTo(45);
		},
		function() {
			selectVisibleSliders({
				contactsPerDay: true,
				probInfection: true
			});
			
			addR0indicator();
		},
		function() {
			selectVisibleSliders({});
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2);
			
			removeR0indicator();
		}),

	new Slide(L({
			en: `At last, try to implement an isolation period. Are you able to prevent an outbreak?`,
			fr: `Finalement, essayez d'imposer une p??riode de confinement. Pouvez-vous emp??cher une ??pid??mie ?`,
			es: `Por ??ltimo, intente aplicar un per??odo de aislamiento. ??Es capaz impedir una epidemia?`
		}),
		function() {
			selectVisibleSliders({
				timeEnd: true,
				isolationStart: true
			});
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.timeEnd.animTo(180, false);
			sliders.isolationStart.animTo(366, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),

	new Slide(L({
			en: `The isolation period was <u>too short</u>! You probably just observed that it can have <u>disastrous consequences</u>. You can now control the isolation duration. Try to minimize the number of <span class="D">Deaths</span>.`,
			fr: `La p??riode de confinement ??tait <u>trop courte</u> ! Vous avez probablement pu constater que cela peut avoir des <u>cons??quences d??sastreuses</u>. Vous pouvez maintenant contr??ler la dur??e de l'isolation. Essayez de minimiser le nombre de <span class="D">D??c??s</span>.`,
			es: `??El per??odo de aislamiento es <u>muy corto</u>! Ha probablemente observado que puede tener <u>consecuencias desastrosas</u>. Puede ahora controlar la duraci??n del aislamiento. Trate de minimisar la cantidad de <span class="D">Fallecimientos</span>.`
		}),
		function() {
			selectVisibleSliders({
				timeEnd: true,
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
		},
		function() {
			selectVisibleSliders({});
			graph1.hide();
			graph2.hide();
			graph3.hide();
		},
		function() {
			$("mainText").style.bottom = "5%";
			
			selectVisibleSliders({
				timeEnd: true,
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
			graph1.show();
			graph2.show();
			graph3.show();
		},
		function() {
			selectVisibleSliders({
				timeEnd: true,
				isolationStart: true
			});
			sliders.isolationDuration.animTo(45, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),

	new Slide(L({
			en: `You have now seen the reason for flattening <i>the Curve</i>: <u>the number of <span class="I">Infected</span> people should not overcrowd the <span class="H">Hospitals</span></u>, as this results in a drastic increase of the number of further <span class="I">infections</span> and <span class="D">deaths</span>.`,
			fr: `Vous avez ?? pr??sent vu la raison pour laquelle <i>la Courbe</i> doit ??tre aplatie : <u>le nombre de personnes <span class="I">Infect??es</span> ne doit pas surcharger les <span class="H">H??pitaux</span></u>, cela r??sultant en une augmentation drastique du nombre d'<span class="I">infections</span> et de <span class="D">d??c??s</span> ?? suivre.`,
			es: `Ahora ha visto la raz??n por la cual <i>la Curva</i> debe ser aplanada: <u>la cantidad de personas <span class="I">Infectadas</span> no debe sobrecargar los <span class="H">Hospitales</span></u>, esto resulta en un aumento dr??stico de la cantidad de <span class="I">infecciones</span> y de <span class="D">fallecimientos</span> a continuaci??n.`
		}),
		function() {
			$("mainText").style.bottom = L({en: "43%", fr: "43%", es: "44%"});
		},
		()=>0,
		function() {
			$("mainText").style.bottom = L({en: "43%", fr: "43%", es: "44%"});
		},
		()=>0),

	new Slide(L({
			en: `Do not forget your individual contribution: <u>keep safe distances</u> and maintain a <u>flawless hygiene</u>.`,
			fr: `N'oubliez pas votre contribution personnelle : <u>gardez vos distances</u> et entretenez une <u>hygi??ne irr??prochable</u>.`,
			es: `No se olvide de su contribuci??n individual: <u>mantenga las distancias</u> y una <u>higiene irreprochable</u>.`
		}),
		function() {
			$("mainText").style.bottom = "45%";
		},
		()=>0,
		function() {
			$("mainText").style.bottom = "45%";
		},
		()=>0),

	new Slide(L({
			en: `Also, SHARE this presentation with maximum R<sub>0</sub> to raise awareness around you!`,
			fr: `Et aussi, PARTAGEZ cette pr??sentation avec un R<sub>0</sub> maximal pour sensibiliser votre entourage !`,
			es: `Adem??s, ??COMPARTE esta presentaci??n con un R<sub>0</sub> m??ximo para sensibilizar a su entorno!`
		}),
		function() {
			$("mainText").style.bottom = L({en: "47%", fr: "44%", es: "47%"});
		},
		()=>0,
		function() {
			$("mainText").style.bottom = L({en: "47%", fr: "44%", es: "47%"});
		},
		()=>0),

	new Slide(L({
			en: `You can now head over to the <i>Playground</i> from the title page to play with the full model! Remember that this very simplified simulation is not intended to be perfectly realistic. Do not try to predic accurate numbers with it.`,
			fr: `Vous pouvez ?? pr??sent vous rendre sur le <i>Bac ?? sable</i> depuis la page de titre pour jouer avec le mod??le complet ! Gardez ?? l'esprit que cette simulation n'est pas destin??e ?? ??tre parfaitement r??aliste. N'essayer pas de pr??dire des chiffres pr??cis avec.`,
			es: `??Ahora puede dirigirse hasta el <i>??rea de prueba</i> desde la p??gina de t??tulo para jugar con el modelo completo! Tenga en mente que esta simulaci??n no esta destinada a ser perfectamente realista. No intente predecir cifras precisas con ello.`
		}),
		function() {
			$("mainText").style.bottom = "44%";
		},
		()=>0,
		()=>0,
		()=>0),
];


playground = [
	new Slide(`R<sub>0</sub> = `,
		function() {
			moveSliders(70, 0);
			showSliders();
			
			sliders.timeEnd.                update(180);
			sliders.initialContamination.   update(-2);   // 1%
			sliders.contactsPerDay.         update(10);
			sliders.probInfection.          update(0.2);   // 4%
			sliders.daysBeforeHospital.     update(4);
			sliders.daysInfectious.         update(10);
			sliders.hospitalCapacity.       update(0.224); // 5%
			sliders.daysImmunity.           update(62);
			sliders.isolationStart.         update(366);   // never
			sliders.mortality.              update(0.316); // 10%
			sliders.isolationDuration.      update(366);   // forever
			sliders.mortalityHospital.      update(0.141); // 2%
			sliders.vaccineDay.             update(731);   // never
			sliders.contactsPerDayIsolation.update(3);
			
			selectVisibleSliders({
				timeEnd:                 true,
				initialContamination:    true,
				contactsPerDay:          true,
				probInfection:           true,
				daysBeforeHospital:      true,
				daysInfectious:          true,
				hospitalCapacity:        true,
				daysImmunity:            true,
				isolationStart:          true,
				mortality:               true,
				isolationDuration:       true,
				mortalityHospital:       true,
				vaccineDay:              true,
				contactsPerDayIsolation: true
			});
			
			simulate();
			
			graph1.move(5, 5, 55, 55);
			graph1.update();
			graph1.plotAll();
			graph1.show();
			
			graph2.move(2, 63, 32, 32);
			graph2.update();
			graph2.plotAll();
			graph2.show();
			
			graph3.move(35, 63, 32, 32);
			graph3.update();
			graph3.plotAll();
			graph3.show();
			
			$("mainText").style.left = "-9.3%";
			$("mainText").style.bottom = "33%";
			addR0indicator();
		})
];


function addR0indicator() {
	let R0 = document.createElement("span");
	$("mainText").append(R0);
	
	let updateR0 = function() {
		R0.innerHTML = (sliders.contactsPerDay.value * sliders.probInfection.value * sliders.daysInfectious.value).toFixed(2);
	};
	
	updateR0();
	
	sliders.contactsPerDay.slider.oninput = function() {
		sliders.contactsPerDay.update();
		updateR0();
	};
	
	sliders.probInfection.slider.oninput = function() {
		sliders.probInfection.update();
		updateR0();
	};
	
	sliders.daysInfectious.slider.oninput = function() {
		sliders.daysInfectious.update();
		updateR0();
	};
}

function removeR0indicator() {
	sliders.contactsPerDay.slider.oninput = function() {
		sliders.contactsPerDay.update();
	};
	
	sliders.probInfection.slider.oninput = function() {
		sliders.probInfection.update();
	};
	
	sliders.daysInfectious.slider.oninput = function() {
		sliders.daysInfectious.update();
	};
}