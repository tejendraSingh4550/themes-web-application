import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Theme {
  id: number; name: string; category: string; creator: string; image: string;
  colors: string[]; rating: string; downloads: string; premium?: boolean; isNew?: boolean;
}

@Component({
  selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div class="app-shell">
      <aside class="sidebar" [class.sidebar-open]="mobileMenu">
        <a class="brand" href="#" aria-label="Theme Studio home"><span class="brand-mark"><span></span><span></span><span></span><span></span></span><span>theme<span class="brand-light">studio</span></span></a>
        <div class="side-label">WORKSPACE</div>
        <nav class="side-nav">
          <button class="nav-item active" (click)="selectNav('Explore')"><span class="nav-icon">◈</span> Explore <span class="nav-dot"></span></button>
          <button class="nav-item" (click)="selectNav('My themes')"><span class="nav-icon">▧</span> My themes <span class="nav-count">04</span></button>
          <button class="nav-item" (click)="selectNav('Favorites')"><span class="nav-icon">♡</span> Favorites <span class="nav-count">{{ favorites.length | number:'2.0' }}</span></button>
        </nav>
        <div class="side-label category-label">CATEGORIES <button class="plus-btn" aria-label="Add category">+</button></div>
        <nav class="side-nav category-nav">
          <button class="nav-item" [class.active]="activeCategory === 'All themes'" (click)="setCategory('All themes')"><span class="category-swatch all-swatch">✳</span> All themes</button>
          <button class="nav-item" [class.active]="activeCategory === 'Minimal'" (click)="setCategory('Minimal')"><span class="category-swatch minimal-swatch"></span> Minimal</button>
          <button class="nav-item" [class.active]="activeCategory === 'Creative'" (click)="setCategory('Creative')"><span class="category-swatch creative-swatch"></span> Creative</button>
          <button class="nav-item" [class.active]="activeCategory === 'Business'" (click)="setCategory('Business')"><span class="category-swatch business-swatch"></span> Business</button>
          <button class="nav-item" [class.active]="activeCategory === 'Portfolio'" (click)="setCategory('Portfolio')"><span class="category-swatch portfolio-swatch"></span> Portfolio</button>
          <button class="nav-item" [class.active]="activeCategory === 'E-commerce'" (click)="setCategory('E-commerce')"><span class="category-swatch commerce-swatch"></span> E-commerce</button>
        </nav>
        <div class="sidebar-bottom">
          <div class="upgrade-card"><div class="upgrade-spark">✦</div><strong>Make it yours</strong><p>Unlock every theme and make your next big idea happen.</p><button (click)="notice = 'Pro plan coming soon ✨'">Explore Pro <span>↗</span></button><div class="upgrade-orb"></div></div>
          <button class="profile"><span class="avatar">JD</span><span class="profile-text"><strong>Jamie Davis</strong><small>Free plan</small></span><span class="more">···</span></button>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar"><button class="mobile-menu" (click)="mobileMenu = !mobileMenu" aria-label="Toggle menu">☰</button><div class="breadcrumbs"><span>Workspace</span><span class="crumb-slash">/</span><strong>{{ activeCategory === 'All themes' ? 'Explore themes' : activeCategory }}</strong></div><div class="top-actions"><button class="icon-button" aria-label="Notifications" (click)="notice = 'You’re all caught up!'">♧<i></i></button><button class="help-button" (click)="notice = 'Welcome to Theme Studio — pick a theme and make it yours.'">Need help?</button><span class="top-avatar">JD</span></div></header>

        <section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-star">✳</span> YOUR NEXT BIG IDEA STARTS HERE</div><h1>Find your next<br><em>favorite</em> look.</h1><p>Beautifully crafted themes for wherever your<br class="desktop-break"> ideas take you.</p><div class="hero-meta"><span class="online-dot"></span> <strong>2,400+</strong> themes and counting <span class="meta-divider">·</span> Made for makers</div></div><div class="hero-art"><div class="art-dots"></div><div class="sun-disc"></div><div class="art-window"><div class="window-bar"><i></i><i></i><i></i><span>your next project</span></div><div class="window-layout"><div class="window-sidebar"><b></b><b></b><b></b><b></b></div><div class="window-main"><div class="window-art"><span>FORM<br>FOLLOWS<br><i>FEELING.</i></span><div class="window-shape"></div></div><div class="window-line"></div><div class="window-line short"></div><div class="window-thumbs"><b></b><b></b><b></b></div></div></div></div><div class="floating-badge badge-top"><span>✦</span> Made for your next</div><div class="floating-badge badge-bottom"><span>✳</span> 100% customizable</div><div class="hero-asterisk">✳</div><div class="hero-leaf">〰</div></div><div class="hero-index">01 <span>/</span> 04</div><div class="hero-progress"><i></i><i></i><i></i><i></i></div></section>

        <section class="browse-section"><div class="section-heading"><div><div class="section-kicker">THE GOOD STUFF</div><h2>{{ activeCategory === 'Favorites' ? 'Your favorites' : activeCategory === 'My themes' ? 'Your themes' : 'Explore themes' }}<span class="result-count">{{ filteredThemes.length }}</span></h2></div><button class="view-all" (click)="setCategory('All themes')">View all themes <span>↗</span></button></div>
          <div class="toolbar"><div class="filter-tabs"><button *ngFor="let tab of tabs" [class.selected]="activeTab === tab" (click)="activeTab = tab">{{ tab }}<span *ngIf="tab === 'Popular'" class="tab-spark">✦</span></button></div><div class="toolbar-right"><label class="search-box"><span>⌕</span><input [(ngModel)]="searchQuery" placeholder="Search themes..." aria-label="Search themes"><kbd>⌘ K</kbd></label><button class="sort-button" (click)="toggleSort()">⇅ <span>{{ sortLabel }}</span><span class="chevron">⌄</span></button></div></div>
          <div class="theme-grid" *ngIf="filteredThemes.length; else emptyState"><article class="theme-card" *ngFor="let theme of filteredThemes"><div class="card-preview" [style.background-image]="'url(' + theme.image + ')'" (click)="openPreview(theme)"><div class="preview-overlay"></div><span class="card-tag" *ngIf="theme.isNew">NEW</span><span class="premium-tag" *ngIf="theme.premium">✦ PRO</span><button class="favorite-btn" [class.is-favorite]="favorites.includes(theme.id)" (click)="$event.stopPropagation(); toggleFavorite(theme.id)" [attr.aria-label]="favorites.includes(theme.id) ? 'Remove favorite' : 'Add favorite'">{{ favorites.includes(theme.id) ? '♥' : '♡' }}</button><button class="quick-preview" (click)="$event.stopPropagation(); openPreview(theme)">Quick preview <span>↗</span></button><div class="color-dots"><span *ngFor="let color of theme.colors" [style.background]="color"></span></div></div><div class="card-info"><div class="card-title-row"><div><h3>{{ theme.name }}</h3><p>by {{ theme.creator }}</p></div><button class="more-card" (click)="openPreview(theme)" aria-label="More options">···</button></div><div class="card-footer"><span class="category-pill">{{ theme.category }}</span><span class="card-stats"><span>☆ {{ theme.rating }}</span><span>↓ {{ theme.downloads }}</span></span></div></div></article></div>
          <ng-template #emptyState><div class="empty-state"><span>✳</span><h3>No themes found</h3><p>Try a different search or category.</p><button (click)="searchQuery = ''; setCategory('All themes')">Clear filters</button></div></ng-template>
          <div class="load-more" *ngIf="filteredThemes.length"><span>SHOWING {{ filteredThemes.length }} OF 2,400+ THEMES</span><div><i></i></div><button (click)="notice = 'You’re all caught up on this page!'">Load more themes <span>↓</span></button></div>
        </section>
        <footer><span>© 2024 Theme Studio</span><span>Made with a little <b>✳</b> and a lot of care.</span><a href="#" (click)="$event.preventDefault(); notice = 'Terms & privacy information';">Terms & privacy ↗</a></footer>
      </main>
    </div>
    <div class="toast" *ngIf="notice" (click)="notice = ''">{{ notice }} <button>×</button></div>
    <div class="modal-backdrop" *ngIf="selectedTheme" (click)="selectedTheme = null"><div class="preview-modal" (click)="$event.stopPropagation()"><button class="modal-close" (click)="selectedTheme = null">×</button><div class="modal-image" [style.background-image]="'url(' + selectedTheme.image + ')'"><span class="modal-label">THEME PREVIEW</span></div><div class="modal-details"><span class="category-pill">{{ selectedTheme.category }}</span><h2>{{ selectedTheme.name }}</h2><p>A thoughtfully designed theme by {{ selectedTheme.creator }}, ready to make your next idea stand out.</p><div class="modal-colors"><span *ngFor="let color of selectedTheme.colors" [style.background]="color"></span></div><div class="modal-actions"><button class="secondary-action" (click)="toggleFavorite(selectedTheme.id)">{{ favorites.includes(selectedTheme.id) ? '♥ Saved' : '♡ Save theme' }}</button><button class="primary-action" (click)="notice = selectedTheme.name + ' added to your themes'; selectedTheme = null">Use this theme <span>↗</span></button></div></div></div></div>
  `
})
export class AppComponent {
  searchQuery = ''; activeCategory = 'All themes'; activeTab = 'All themes'; sortLabel = 'Most popular'; sortAscending = false; mobileMenu = false; notice = ''; selectedTheme: Theme | null = null;
  tabs = ['All themes', 'Popular', 'New & noteworthy'];
  favorites: number[] = [2];
  themes: Theme[] = [
    { id: 1, name: 'Sunday Studio', category: 'Portfolio', creator: 'Maya Chen', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85', colors: ['#dfbda3','#eff0e6','#85816e'], rating: '4.9', downloads: '1.2k', isNew: true },
    { id: 2, name: 'Forma Objects', category: 'E-commerce', creator: 'Studio Folk', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85', colors: ['#ebd9bd','#adb29d','#d28a61'], rating: '4.8', downloads: '980', premium: true },
    { id: 3, name: 'The Good Space', category: 'Business', creator: 'Oliver James', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85', colors: ['#c9c5b6','#737c68','#e4d6bf'], rating: '5.0', downloads: '2.4k', isNew: true },
    { id: 4, name: 'Soft Focus', category: 'Creative', creator: 'Noah Williams', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85', colors: ['#dfd8cc','#b59d86','#34382f'], rating: '4.9', downloads: '1.8k' },
    { id: 5, name: 'Atelier No. 8', category: 'Minimal', creator: 'Elise Moreau', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85', colors: ['#e8e4db','#aca792','#292b27'], rating: '4.7', downloads: '864', premium: true },
    { id: 6, name: 'Casa Verde', category: 'E-commerce', creator: 'The Sundays', image: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=900&q=85', colors: ['#a6a58f','#d6bf9e','#f1ece0'], rating: '4.9', downloads: '1.6k' },
    { id: 7, name: 'Objects & Co.', category: 'Business', creator: 'Alex Rivera', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=85', colors: ['#d7cbb8','#8c897e','#bb7758'], rating: '4.8', downloads: '732', isNew: true },
    { id: 8, name: 'Sunday Paper', category: 'Portfolio', creator: 'Mina Park', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85', colors: ['#e7e2d8','#ad9983','#485046'], rating: '4.9', downloads: '2.1k', premium: true }
  ];
  get filteredThemes(): Theme[] {
    let result = this.themes.filter(t => {
      const matchesCategory = this.activeCategory === 'All themes' || (this.activeCategory === 'Favorites' ? this.favorites.includes(t.id) : this.activeCategory === 'My themes' ? [1, 3, 5, 8].includes(t.id) : t.category === this.activeCategory);
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q || `${t.name} ${t.category} ${t.creator}`.toLowerCase().includes(q);
      const matchesTab = this.activeTab === 'All themes' || (this.activeTab === 'Popular' ? parseFloat(t.rating) >= 4.8 : t.isNew);
      return matchesCategory && matchesSearch && matchesTab;
    });
    if (this.sortAscending) result = [...result].reverse();
    return result;
  }
  setCategory(category: string) { this.activeCategory = category; this.activeTab = 'All themes'; this.mobileMenu = false; }
  selectNav(nav: string) { this.setCategory(nav); }
  toggleFavorite(id: number) { this.favorites = this.favorites.includes(id) ? this.favorites.filter(f => f !== id) : [...this.favorites, id]; }
  toggleSort() { this.sortAscending = !this.sortAscending; this.sortLabel = this.sortAscending ? 'Recently added' : 'Most popular'; }
  openPreview(theme: Theme) { this.selectedTheme = theme; }
}

bootstrapApplication(AppComponent).catch(err => console.error(err));
