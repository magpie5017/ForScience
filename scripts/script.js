function game() {
	var self = this;
	var newslog = ko.observable("You are scientist z");
	var newitem = ko.observable(" "); 
	
	//Initial Game Values
	self.ival = {
		clicks: {
			amount: 0
		},
		programs: {
			amount: 0,
			cost: 5,
			costModifier: 1,
			efficacyModifier: 1	
		},
		money: {
			amount: 0,
			cost: 5,
			costModifier: 1	
		},
		papers: {
			amount: 0,
			cost: {
				research: 5,
				money: 5	
			},
			costModifier: 1
		},
		cabinets: {
			amount: 1,
			cost: 5,
			limit: 1000	
		}
	};
	
	self.clicks = {
		amount: ko.observable(self.ival.clicks.amount, {persist: 'self.clicks.amount'})
	};
	self.programs = { //to add: cost increase per purchase
		amount: ko.observable(self.ival.programs.amount, {persist: 'self.programs.amount'}),
		cost: ko.observable(self.ival.programs.cost, {persist: 'self.programs.cost'}), //research
		costModifier: ko.observable(self.ival.programs.costModifier, {persist: 'self.programs.costModifier'}),
		efficacyModifier: ko.observable(self.ival.programs.efficacyModifier, {persist: 'self.programs.efficacyModifier'})
	};
	self.money = {
		amount: ko.observable(self.ival.money.amount, {persist: 'self.money.amount'}),
		cost: ko.observable(self.ival.money.cost, {persist: 'self.money.cost'}), //research
		costModifier: ko.observable(self.ival.money.costModifier, {persist: 'self.money.costModifier'})
	};
	self.papers = {
		amount: ko.observable(self.ival.papers.amount, {persist: 'self.papers.amount'}),
		cost: {
			research: ko.observable(self.ival.papers.cost.research, {persist: 'self.papers.cost.reseach'}),
			money: ko.observable(self.ival.papers.cost.money, {persist: 'self.papers.cost.money'})	
		},
		costModifier: ko.observable(self.ival.papers.costModifier, {persist: 'self.papers.costModifier'})
	};
	self.cabinets = {
		amount: ko.observable(self.ival.cabinets.amount, {persist: 'self.cabinets.amount'}),
		cost: ko.observable(self.ival.cabinets.cost, {persist: 'self.cabinets.cost'}), //money
		limit: ko.observable(self.ival.cabinets.limit, {persist: 'self.cabinets.limit'})
	};
	
	//Computed Variables
	self.cabinets.capacity = ko.computed(function() {
			return self.cabinets.amount() * self.cabinets.limit();
		}, self);
		
	self.programs.rps = ko.computed(function() {
			return self.programs.amount() * self.programs.efficacyModifier();
		}, self);

	//Buy Resources Functions
    self.increaseClicks = function() {
		if (self.clicks.amount() < self.cabinets.capacity()) {
        	self.clicks.amount(self.clicks.amount() + 1);
		};
    };
    self.buyProgram = function() {
		if (self.clicks.amount() >= self.programs.cost()) {
			self.clicks.amount(self.clicks.amount() - (self.programs.cost() * self.programs.costModifier()));
			self.programs.amount(self.programs.amount() + 1);
			self.programs.cost(self.programs.cost() + 1);
		};
    };
	self.buyMoney = function() {
		if (self.clicks.amount() >= self.money.cost()) {
			self.clicks.amount(self.clicks.amount() - (self.money.cost() * self.money.costModifier()));
			self.money.amount(self.money.amount() + 1);
		};
    };
	self.buyPapers = function() {
		if (self.clicks.amount() >= self.papers.cost.research() && self.money.amount() >= self.papers.cost.money()) {
			self.clicks.amount(self.clicks.amount() - self.papers.cost.research());
			self.money.amount(self.money.amount() - self.papers.cost.money());
			self.papers.amount(self.papers.amount() + 1);
		};
    };
	self.buyCabinets = function() {
		if (self.money.amount() >= self.cabinets.cost()) {
			self.money.amount(self.money.amount() - self.cabinets.cost());
			self.cabinets.amount(self.cabinets.amount() + 1);
		};
    };
	
	//Run Auto-Clicker every second
	setInterval(function () {
		if (self.clicks.amount() < self.cabinets.capacity()) {
			return self.clicks.amount(self.clicks.amount() + self.programs.rps());
		};
    }, 1000);	
	
	//Flash Autosaving every 7 seconds	
	setInterval(function () {
		$("#autosavenote").fadeIn("slow");
		$("#autosavenote").delay(1000)
		$("#autosavenote").fadeOut("slow");
	}, 7000);
	
	//Reset Function
	self.resetGame = function() {
		var foo = confirm("Are you sure you want to reset? You will lose all of your game progress!");
		if (foo == true) {
			self.clicks.amount(self.ival.clicks.amount);
			
			self.programs.amount(self.ival.programs.amount);
			self.programs.cost(self.ival.programs.cost);
			self.programs.costModifier(self.ival.programs.costModifier);
			self.programs.efficacyModifier(self.ival.programs.efficacyModifier);
			
			self.money.amount(self.ival.money.amount);
			self.money.cost(self.ival.money.cost);
			self.money.costModifier(self.ival.money.costModifier);
			
			self.papers.amount(self.ival.papers.amount);
			self.papers.cost.research(self.ival.papers.cost.research);
			self.papers.cost.money(self.ival.papers.cost.money);
			self.papers.costModifier(self.ival.papers.costModifier);
			
			self.cabinets.amount(self.ival.cabinets.amount);
			self.cabinets.cost(self.ival.cabinets.cost);
			self.cabinets.limit(self.ival.cabinets.limit);
		} else {
			alert("Not resetting yet? Ok!");
		};
	};

}

ko.applyBindings(game()); //attempt to load the game on startup