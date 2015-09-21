function game() {
	var self = this;
	var newslog = ko.observable("You are scientist z");
	var newitem = ko.observable(" "); // NEED TO FINISH (news log is orig + newitem, add to new item w/ each action, recalculate newslog
	self.clicks = {
		amount: ko.observable(0, {persist: 'self.clicks.amount'})
	};
	self.programs = { //to add: cost increase per purchase
		amount: ko.observable(0, {persist: 'self.programs.amount'}),
		cost: 5, //research
		costModifier: 1,
		efficacyModifier: 1
	};
	self.money = {
		amount: ko.observable(0, {persist: 'self.money.amount'}),
		cost: 5, //research
		costModifier: 1
	};
	self.papers = {
		amount: ko.observable(0, {persist: 'self.papers.amount'}),
		cost: {
			research: 5,
			money: 5	
		},
		costModifier: 1
	};
	self.cabinets = {
		amount: ko.observable(1, {persist: 'self.cabinets.amount'}),
		cost: 5, //money
		limit: 1000
	};
	
	//Computed Variables
	self.cabinets.capacity = ko.computed(function() {
			return self.cabinets.amount() * self.cabinets.limit;
		}, self);
		
	self.programs.rps = ko.computed(function() {
			return self.programs.amount() * self.programs.efficacyModifier;
		}, self);

	//Buy Resources Functions
    self.increaseClicks = function() {
		if (self.clicks.amount() < self.cabinets.capacity()) {
        	self.clicks.amount(self.clicks.amount() + 1);
		};
    };
    self.buyProgram = function() {
		if (self.clicks.amount() >= self.programs.cost) {
			self.clicks.amount(self.clicks.amount() - (self.programs.cost * self.programs.costModifier));
			self.programs.amount(self.programs.amount() + 1);
			self.programs.cost++;
		};
    };
	self.buyMoney = function() {
		if (self.clicks.amount() >= self.money.cost) {
			self.clicks.amount(self.clicks.amount() - (self.money.cost * self.money.costModifier));
			self.money.amount(self.money.amount() + 1);
		};
    };
	self.buyPapers = function() {
		if (self.clicks.amount() >= self.papers.cost.research && self.money.amount() >= self.papers.cost.money) {
			self.clicks.amount(self.clicks.amount() - self.papers.cost.research);
			self.money.amount(self.money.amount() - self.papers.cost.money);
			self.papers.amount(self.papers.amount() + 1);
		};
    };
	self.buyCabinets = function() {
		if (self.money.amount() >= self.cabinets.cost) {
			self.money.amount(self.money.amount() - self.cabinets.cost);
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

	self.resetGame = function() {
		self.clicks.amount(null);
	};
	
};

/*document.getElementById("resetgame").onclick = function() {
	game(null);
};*/

ko.applyBindings(game()); //attempt to load the game on startup