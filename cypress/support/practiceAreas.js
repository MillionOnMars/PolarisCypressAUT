const TIMEOUT = 10000;

// Helper function to get random practice areas
const getRandomAreas = (areas, count) => {
    const shuffled = [...areas].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Navigate to a specific practice area
const navigateToPracticeArea = (practiceArea, specificNavItem = null) => {
    cy.contains(practiceArea, { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .click({ force: true });
    
    cy.wait(1000);
    
    if (specificNavItem) {
        cy.contains(specificNavItem, { timeout: TIMEOUT })
            .should('exist')
            .click({ force: true });
    }
    
    cy.wait(2000);
};

// Verify that the specific navigation item is present and accessible
const verifySpecificNavItem = (specificNavItem) => {
    if (specificNavItem) {
        cy.contains(specificNavItem, { timeout: TIMEOUT })
            .should('exist');
    }
};

// Verify any tabs are present
const verifyTabsExist = () => {
    cy.get('[role="tab"], .tab, .MuiTab-root', { timeout: TIMEOUT })
        .should('have.length.at.least', 1)
        .should('be.visible')
        .each(($tab, index) => {
            const tabText = $tab.text().trim();
            if (tabText) {
                cy.get('[role="tab"], .tab, .MuiTab-root', { timeout: TIMEOUT })
                    .eq(index)
                    .click({ force: true });
                
                cy.wait(1000);
                
                cy.get('[role="tab"], .tab, .MuiTab-root', { timeout: TIMEOUT })
                    .eq(index)
                    .should('satisfy', ($el) => {
                        return $el.hasClass('active') || 
                               $el.hasClass('Mui-selected') ||
                               $el.attr('aria-selected') === 'true';
                    });
            }
        });
};

// Core test functions
const verifyNoAccessArea = (practiceArea, specificNavItem = null) => {
    navigateToPracticeArea(practiceArea, specificNavItem);
    
    cy.get('p[aria-label*="Contact Sales"].MuiTypography-root.MuiTypography-body-md', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const verifyFullAccess = (practiceArea, specificNavItem = null) => {
    navigateToPracticeArea(practiceArea, specificNavItem);
    verifySpecificNavItem(specificNavItem);
    verifyTabsExist();
};

const verifyTilesVisibility = (practiceArea, specificNavItem = null) => {
    navigateToPracticeArea(practiceArea, specificNavItem);
    
    cy.fixture('data.json').then((data) => {
        const expectedTileText = data.practiceAreas.expectedTiles[practiceArea];
        
        if (expectedTileText) {
            cy.contains(expectedTileText, { timeout: TIMEOUT })
                .should('exist')
                .should('be.visible');
        }
        
        cy.get('body').then($body => {
            const hasCharts = $body.find('canvas, svg, .chart, [data-testid*="chart"]').length > 0;
            const hasVisualizations = $body.find('.visualization, .graph, .plot').length > 0;
            const hasContent = $body.find('[class*="content"], [class*="data"], .MuiBox-root').length > 0;
            
            if (!hasCharts && !hasVisualizations && !hasContent) {
                cy.get('main, .main-content, [role="main"], .MuiBox-root')
                    .should('exist')
                    .should('be.visible');
            }
        });
    });
};

class PracticeAreas {
    static getRandomAreas(areas, count) {
        return getRandomAreas(areas, count);
    }

    static testUnsubscribedAccess() {
        it('Should load data and test unsubscribed practice areas', () => {
            cy.fixture('data.json').then((data) => {
                data.practiceAreas.unsubscribed.forEach((practiceArea) => {
                    const specificNavItem = data.practiceAreas.specificNavItems[practiceArea] || null;
                    verifyNoAccessArea(practiceArea, specificNavItem);
                });
            });
        });
    }

    static testSubscribedAccess() {
        it('Should load data and test subscribed practice areas', () => {
            cy.fixture('data.json').then((data) => {
                data.practiceAreas.subscribed.slice(0, 2).forEach((practiceArea) => {
                    const specificNavItem = data.practiceAreas.specificNavItems[practiceArea] || null;
                    verifyFullAccess(practiceArea, specificNavItem);
                });
            });
        });
    }

    static testNavigationAndTabSwitching() {
        it('Should navigate through different tabs and verify content for a random practice area', () => {
            cy.fixture('data.json').then((data) => {
                const randomPracticeArea = getRandomAreas(data.practiceAreas.subscribed, 1)[0];
                const specificNavItem = data.practiceAreas.specificNavItems[randomPracticeArea];
                
                navigateToPracticeArea(randomPracticeArea, specificNavItem);
                verifyTabsExist();
            });
        });
    }

    static testTilesVisibility() {
        it('Should verify tiles are visible for a random practice area', () => {
            cy.fixture('data.json').then((data) => {
                const randomPracticeArea = getRandomAreas(data.practiceAreas.subscribed, 1)[0];
                const specificNavItem = data.practiceAreas.specificNavItems[randomPracticeArea];
                
                verifyTilesVisibility(randomPracticeArea, specificNavItem);
            });
        });
    }

    static testRandomSubscribedAreas() {
        it('Should test random subscribed practice areas', () => {
            cy.fixture('data.json').then((data) => {
                const randomAreas = getRandomAreas(data.practiceAreas.subscribed, 2);
                
                randomAreas.forEach((practiceArea) => {
                    const specificNavItem = data.practiceAreas.specificNavItems[practiceArea] || null;
                    verifyFullAccess(practiceArea, specificNavItem);
                });
            });
        });
    }

    static testRandomUnsubscribedAreas() {
        it('Should test random unsubscribed practice areas', () => {
            cy.fixture('data.json').then((data) => {
                const randomAreas = getRandomAreas(data.practiceAreas.unsubscribed, 2);
                
                randomAreas.forEach((practiceArea) => {
                    const specificNavItem = data.practiceAreas.specificNavItems[practiceArea] || null;
                    verifyNoAccessArea(practiceArea, specificNavItem);
                });
            });
        });
    }

    static testAllUnsubscribedAreasFromData() {
        it('Should verify all unsubscribed areas from data.json', () => {
            cy.fixture('data.json').then((data) => {
                data.practiceAreas.unsubscribed.forEach((practiceArea) => {
                    const specificNavItem = data.practiceAreas.specificNavItems[practiceArea] || null;
                    verifyNoAccessArea(practiceArea, specificNavItem);
                });
            });
        });
    }

    static testAllSubscribedAreasFromData() {
        it('Should verify all subscribed areas from data.json', () => {
            cy.fixture('data.json').then((data) => {
                data.practiceAreas.subscribed.forEach((practiceArea) => {
                    const specificNavItem = data.practiceAreas.specificNavItems[practiceArea] || null;
                    verifyFullAccess(practiceArea, specificNavItem);
                });
            });
        });
    }
}

export default PracticeAreas;