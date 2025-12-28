# SmartGesti Ensino - Design System

Este documento define o sistema de design e padrões de cores para manter consistência visual em todo o projeto.

## 🎨 Sistema de Temas

O projeto suporta **tema claro** e **tema escuro** com troca automática via `ThemeContext`.

### Configuração Técnica

```css
/* Tailwind v4 - Dark mode via classe */
@custom-variant dark (&:is(.dark *));
```

A classe `.dark` é adicionada ao `<html>` para ativar o tema escuro.

---

## 🎯 Paleta de Cores

### Cores Primárias (Azul)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Títulos principais | `blue-600` | `blue-400` | `text-blue-600 dark:text-blue-400` |
| Botões primários | `blue-500` | `blue-500` | `bg-blue-500 hover:bg-blue-600` |
| Links | `blue-600` | `blue-400` | `text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300` |
| Focus de inputs | `blue-500` | `blue-500` | `focus:border-blue-500` |
| Tabs ativas | `blue-500` | `blue-500` | `data-[state=active]:bg-blue-500` |

### Cores de Sucesso (Verde)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Botões de ação positiva | `emerald-500` | `emerald-500` | `bg-emerald-500 hover:bg-emerald-600 text-white` |
| Ícones de sucesso | `green-600` | `green-400` | `text-green-600 dark:text-green-400` |
| Badges de sucesso | `green-100/600` | `green-900/400` | `bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400` |

### Cores de Erro/Destructive (Vermelho)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Textos de erro | `red-600` | `red-400` | `text-red-600 dark:text-red-400` |
| Bordas de erro | `red-500` | `red-500` | `border-red-500` |
| Asterisco obrigatório | `red-500` | `red-500` | `text-red-500` |
| Botões destructive | `red-500` | `red-500` | `bg-red-500 hover:bg-red-600 text-white` |

### Cores Neutras (Cinza)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto principal | `gray-800` | `gray-100` | `text-gray-800 dark:text-gray-100` |
| Texto secundário | `gray-600` | `gray-300` | `text-gray-600 dark:text-gray-300` |
| Texto muted | `gray-500` | `gray-400` | `text-gray-500 dark:text-gray-400` |
| Bordas | `gray-200` | `gray-700` | `border-gray-200 dark:border-gray-700` |
| Backgrounds sutis | `gray-100/50` | `gray-800/50` | `bg-gray-100/50 dark:bg-gray-800/50` |

### Cores de Warning (Amarelo/Âmbar)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto de aviso | `amber-600` | `amber-400` | `text-amber-600 dark:text-amber-400` |
| Botões warning | `amber-500` | `amber-500` | `bg-amber-500 hover:bg-amber-600 text-white` |
| Backgrounds | `amber-50` | `amber-950/30` | `bg-amber-50 dark:bg-amber-950/30` |
| Bordas | `amber-200` | `amber-800` | `border-amber-200 dark:border-amber-800` |
| Ícones | `amber-600` | `amber-400` | `text-amber-600 dark:text-amber-400` |

### Cores de Info (Cyan/Azul Claro)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto info | `cyan-600` | `cyan-400` | `text-cyan-600 dark:text-cyan-400` |
| Botões info | `cyan-500` | `cyan-500` | `bg-cyan-500 hover:bg-cyan-600 text-white` |
| Backgrounds | `cyan-50` | `cyan-950/30` | `bg-cyan-50 dark:bg-cyan-950/30` |
| Bordas | `cyan-200` | `cyan-800` | `border-cyan-200 dark:border-cyan-800` |
| Ícones | `cyan-600` | `cyan-400` | `text-cyan-600 dark:text-cyan-400` |

### Cores Secundárias (Roxo/Violeta)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto roxo | `purple-600` | `purple-400` | `text-purple-600 dark:text-purple-400` |
| Botões roxo | `purple-500` | `purple-500` | `bg-purple-500 hover:bg-purple-600 text-white` |
| Backgrounds | `purple-50` | `purple-950/30` | `bg-purple-50 dark:bg-purple-950/30` |
| Bordas | `purple-200` | `purple-800` | `border-purple-200 dark:border-purple-800` |

### Cores Secundárias (Indigo)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto indigo | `indigo-600` | `indigo-400` | `text-indigo-600 dark:text-indigo-400` |
| Botões indigo | `indigo-500` | `indigo-500` | `bg-indigo-500 hover:bg-indigo-600 text-white` |
| Backgrounds | `indigo-50` | `indigo-950/30` | `bg-indigo-50 dark:bg-indigo-950/30` |
| Bordas | `indigo-200` | `indigo-800` | `border-indigo-200 dark:border-indigo-800` |

### Cores Secundárias (Rosa/Pink)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto rosa | `pink-600` | `pink-400` | `text-pink-600 dark:text-pink-400` |
| Botões rosa | `pink-500` | `pink-500` | `bg-pink-500 hover:bg-pink-600 text-white` |
| Backgrounds | `pink-50` | `pink-950/30` | `bg-pink-50 dark:bg-pink-950/30` |
| Bordas | `pink-200` | `pink-800` | `border-pink-200 dark:border-pink-800` |

### Cores Secundárias (Teal)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto teal | `teal-600` | `teal-400` | `text-teal-600 dark:text-teal-400` |
| Botões teal | `teal-500` | `teal-500` | `bg-teal-500 hover:bg-teal-600 text-white` |
| Backgrounds | `teal-50` | `teal-950/30` | `bg-teal-50 dark:bg-teal-950/30` |
| Bordas | `teal-200` | `teal-800` | `border-teal-200 dark:border-teal-800` |

### Cores Secundárias (Orange)

| Uso | Tema Claro | Tema Escuro | Classes Tailwind |
|-----|------------|-------------|------------------|
| Texto laranja | `orange-600` | `orange-400` | `text-orange-600 dark:text-orange-400` |
| Botões laranja | `orange-500` | `orange-500` | `bg-orange-500 hover:bg-orange-600 text-white` |
| Backgrounds | `orange-50` | `orange-950/30` | `bg-orange-50 dark:bg-orange-950/30` |
| Bordas | `orange-200` | `orange-800` | `border-orange-200 dark:border-orange-800` |

---

## 📝 Componentes

### Títulos com Gradiente

```tsx
<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
  SmartGesti Ensino
</h1>
```

### Títulos Simples

```tsx
// Título principal de página
<h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
  Título da Página
</h1>

// Subtítulo
<p className="text-base text-gray-600 dark:text-gray-300">
  Descrição ou subtítulo
</p>
```

### Inputs

```tsx
<Input
  className="h-11"
  error={!!errorState}
  errorMessage={errorState || undefined}
/>
```

**Estados:**
- Normal: `border-input hover:border-blue-400/50`
- Focus: `focus:border-blue-500` (apenas borda, sem ring)
- Erro: `border-red-500 focus:border-red-500`

### Botões

```tsx
// Botão de ação principal (sucesso/submit)
<Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
  Salvar
</Button>

// Botão primário (azul)
<Button className="bg-blue-500 hover:bg-blue-600 text-white">
  Continuar
</Button>

// Botão outline
<Button variant="outline" className="border-2 border-primary/30 hover:border-primary/50">
  Cancelar
</Button>

// Botão destructive
<Button className="bg-red-500 hover:bg-red-600 text-white">
  Excluir
</Button>
```

**Efeitos de Hover (já aplicados no componente Button):**
- `hover:scale-[1.02]` - micro-zoom elegante
- `hover:shadow-lg` - sombra elevada
- `active:scale-[0.98]` - feedback ao clicar

**Botões Desabilitados:**
- Tema claro: `disabled:opacity-60`
- Tema escuro: `dark:disabled:opacity-40` (mais visível)

**Botão Google (com hover específico):**
- Claro: `hover:bg-gray-100 hover:border-gray-300`
- Escuro: `dark:hover:bg-gray-800 dark:hover:border-gray-600`

**Botão Outline (com hover específico):**
- Claro: `hover:bg-blue-50 hover:border-blue-400`
- Escuro: `dark:hover:bg-blue-950/50 dark:hover:border-blue-500`

### Tabs

```tsx
<TabsList className="bg-gray-100/50 dark:bg-gray-800/50 p-1">
  <TabsTrigger 
    className="text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
  >
    Tab 1
  </TabsTrigger>
</TabsList>
```

### Cards

```tsx
<Card className="shadow-2xl border-2 border-border bg-card">
  <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent">
    <CardTitle className="text-blue-600 dark:text-blue-400">
      Título
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* conteúdo */}
  </CardContent>
</Card>
```

### Divisor com Texto

```tsx
<div className="flex items-center gap-4 my-5">
  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
  <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">ou</span>
  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
</div>
```

### Alerts

```tsx
// Alert de erro (destructive)
<Alert variant="destructive" className="border-red-500">
  <AlertCircle className="h-4 w-4 text-red-500" />
  <AlertDescription className="text-red-600 dark:text-red-400">
    Mensagem de erro
  </AlertDescription>
</Alert>

// Alert de sucesso
<div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
  <div className="flex items-center gap-2">
    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    <p className="text-green-700 dark:text-green-300">Operação realizada com sucesso!</p>
  </div>
</div>

// Alert de warning
<div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
  <div className="flex items-center gap-2">
    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
    <p className="text-amber-700 dark:text-amber-300">Atenção: Esta ação não pode ser desfeita.</p>
  </div>
</div>

// Alert de info
<div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
  <div className="flex items-center gap-2">
    <Info className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
    <p className="text-cyan-700 dark:text-cyan-300">Dica: Você pode personalizar suas preferências.</p>
  </div>
</div>
```

### Labels com Campo Obrigatório

```tsx
<Label required>Nome</Label>
// O asterisco vermelho é renderizado automaticamente
```

### Feature Cards (Sidebar)

```tsx
<div className="flex items-start gap-3 lg:gap-5">
  <div className="p-3 lg:p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
    <Icon className="h-5 w-5 lg:h-7 lg:w-7" />
  </div>
  <div>
    <h3 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
      Título
    </h3>
    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
      Descrição
    </p>
  </div>
</div>
```

**Variações de cor para ícones:**
- Azul: `bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`
- Verde: `bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`
- Roxo: `bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400`

---

## 🌈 Backgrounds e Gradientes

### Página Principal
```tsx
<div className="min-h-screen bg-background">
```

### Gradiente de Sidebar
```tsx
<div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
```

### Header de Card Sutil
```tsx
<div className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent">
```

### Gradientes para Títulos
```tsx
// Gradiente Azul-Indigo-Roxo (padrão)
bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent

// Gradiente Verde-Teal
bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 dark:from-green-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent

// Gradiente Rosa-Roxo
bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent

// Gradiente Laranja-Vermelho
bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent

// Gradiente Amarelo-Laranja
bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent
```

### Gradientes para Backgrounds
```tsx
// Gradiente Hero (páginas de destaque)
bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-900

// Gradiente Sutil (seções)
bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900

// Gradiente Sucesso
bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700

// Gradiente Warning
bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600

// Gradiente Danger
bg-gradient-to-br from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700
```

### Backgrounds Coloridos para Cards/Seções
```tsx
// Azul sutil
bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800

// Verde sutil
bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800

// Amarelo/Warning sutil
bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800

// Vermelho/Erro sutil
bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800

// Roxo sutil
bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800

// Cyan/Info sutil
bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800

// Pink sutil
bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800

// Teal sutil
bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800

// Laranja sutil
bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800
```

---

## 🎯 Badges e Tags

```tsx
// Badge Azul (padrão)
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
  Ativo
</span>

// Badge Verde (sucesso)
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
  Aprovado
</span>

// Badge Amarelo (pendente)
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
  Pendente
</span>

// Badge Vermelho (erro/inativo)
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
  Inativo
</span>

// Badge Roxo
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
  Premium
</span>

// Badge Cinza (neutro)
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
  Rascunho
</span>

// Badge Cyan (info)
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
  Novo
</span>

// Badge Pink
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300">
  Especial
</span>
```

---

## 🟢 Status Indicators

```tsx
// Status Online/Ativo
<div className="flex items-center gap-2">
  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
  <span className="text-green-600 dark:text-green-400">Online</span>
</div>

// Status Offline/Inativo
<div className="flex items-center gap-2">
  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-600"></div>
  <span className="text-gray-600 dark:text-gray-400">Offline</span>
</div>

// Status Ocupado
<div className="flex items-center gap-2">
  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
  <span className="text-red-600 dark:text-red-400">Ocupado</span>
</div>

// Status Ausente
<div className="flex items-center gap-2">
  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
  <span className="text-amber-600 dark:text-amber-400">Ausente</span>
</div>
```

---

## 📊 Progress Bars

```tsx
// Progress Bar Azul
<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
</div>

// Progress Bar Verde (sucesso)
<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
</div>

// Progress Bar Amarelo (warning)
<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }}></div>
</div>

// Progress Bar Vermelho (danger)
<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div className="h-full bg-red-500 rounded-full" style={{ width: '20%' }}></div>
</div>

// Progress Bar Gradiente
<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }}></div>
</div>
```

---

## 🔘 Botões Coloridos Completos

```tsx
// Botão Primário (Azul)
<Button className="bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Ação Primária
</Button>

// Botão Sucesso (Verde)
<Button className="bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Salvar
</Button>

// Botão Warning (Amarelo)
<Button className="bg-amber-500 hover:bg-amber-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Atenção
</Button>

// Botão Danger (Vermelho)
<Button className="bg-red-500 hover:bg-red-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Excluir
</Button>

// Botão Roxo
<Button className="bg-purple-500 hover:bg-purple-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Premium
</Button>

// Botão Indigo
<Button className="bg-indigo-500 hover:bg-indigo-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Configurar
</Button>

// Botão Cyan/Info
<Button className="bg-cyan-500 hover:bg-cyan-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Informação
</Button>

// Botão Teal
<Button className="bg-teal-500 hover:bg-teal-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Processar
</Button>

// Botão Pink
<Button className="bg-pink-500 hover:bg-pink-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Especial
</Button>

// Botão Laranja
<Button className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Ação
</Button>

// Botão Outline Azul
<Button variant="outline" className="border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:scale-[1.02] transition-all">
  Secundário
</Button>

// Botão Outline Verde
<Button variant="outline" className="border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:scale-[1.02] transition-all">
  Confirmar
</Button>

// Botão Ghost Neutro
<Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
  Voltar
</Button>

// Botão Sair/Cancelar (Outline Vermelho) - Para ações negativas
<Button variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-700">
  Sair / Cancelar
</Button>

// Botão Sair Ghost (Vermelho)
<Button variant="ghost" className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
  Sair
</Button>

// Botão Gradiente
<Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all">
  Gradiente
</Button>

// Botão Desabilitado
<Button disabled className="disabled:opacity-60 dark:disabled:opacity-40 disabled:cursor-not-allowed">
  Desabilitado
</Button>
```

---

## 🌑 Sombras (Shadows)

```tsx
// Sombra Pequena
shadow-sm

// Sombra Padrão
shadow

// Sombra Média
shadow-md

// Sombra Grande
shadow-lg

// Sombra Extra Grande
shadow-xl

// Sombra 2XL
shadow-2xl

// Sombra com cor (modo claro/escuro)
shadow-lg shadow-blue-500/20 dark:shadow-blue-400/10
shadow-lg shadow-purple-500/20 dark:shadow-purple-400/10
shadow-lg shadow-emerald-500/20 dark:shadow-emerald-400/10
shadow-lg shadow-red-500/20 dark:shadow-red-400/10

// Sombra interna
shadow-inner

// Sem sombra
shadow-none
```

---

## 📏 Bordas

### Espessuras
```tsx
border        // 1px
border-2      // 2px
border-4      // 4px
border-8      // 8px
```

### Cores de Bordas por Estado
```tsx
// Borda padrão
border-gray-200 dark:border-gray-700

// Borda focada (inputs)
focus:border-blue-500

// Borda hover
hover:border-blue-400/50 dark:hover:border-blue-500/50

// Borda de erro
border-red-500

// Borda de sucesso
border-emerald-500 dark:border-emerald-400

// Borda warning
border-amber-500 dark:border-amber-400

// Borda info
border-cyan-500 dark:border-cyan-400
```

### Bordas Coloridas
```tsx
border-blue-200 dark:border-blue-800
border-green-200 dark:border-green-800
border-red-200 dark:border-red-800
border-amber-200 dark:border-amber-800
border-purple-200 dark:border-purple-800
border-cyan-200 dark:border-cyan-800
border-pink-200 dark:border-pink-800
border-indigo-200 dark:border-indigo-800
border-teal-200 dark:border-teal-800
border-orange-200 dark:border-orange-800
```

### Border Radius
```tsx
rounded-none    // 0
rounded-sm      // 0.125rem
rounded         // 0.25rem
rounded-md      // 0.375rem
rounded-lg      // 0.5rem (padrão inputs/cards)
rounded-xl      // 0.75rem
rounded-2xl     // 1rem
rounded-3xl     // 1.5rem
rounded-full    // 9999px (pills/avatares)
```

---

## 🖼️ Cards Headers/Footers

```tsx
// Card Header Azul Gradiente
<div className="p-4 rounded-t-lg bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
  <h3 className="font-semibold text-blue-600 dark:text-blue-400">Título</h3>
</div>

// Card Header Verde
<div className="p-4 rounded-t-lg bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
  <h3 className="font-semibold text-green-600 dark:text-green-400">Sucesso</h3>
</div>

// Card Header Roxo
<div className="p-4 rounded-t-lg bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
  <h3 className="font-semibold text-purple-600 dark:text-purple-400">Premium</h3>
</div>

// Card Header Warning
<div className="p-4 rounded-t-lg bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
  <h3 className="font-semibold text-amber-600 dark:text-amber-400">Atenção</h3>
</div>

// Card Footer
<div className="p-4 rounded-b-lg bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
  <div className="flex justify-end gap-2">
    <Button variant="ghost">Cancelar</Button>
    <Button>Salvar</Button>
  </div>
</div>
```

---

## ⚡ Transições e Animações

```tsx
// Transição suave (padrão)
transition-all duration-200

// Transição de cores
transition-colors duration-200

// Transição de transformação
transition-transform duration-200

// Transição de opacidade
transition-opacity duration-200

// Hover com scale
hover:scale-[1.02] active:scale-[0.98] transition-transform

// Hover com sombra
hover:shadow-lg transition-shadow

// Animação de pulse
animate-pulse

// Animação de spin (loading)
animate-spin

// Animação de bounce
animate-bounce

// Animação de fade in (custom)
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 🔤 Tipografia

### Tamanhos
```tsx
text-xs       // 0.75rem
text-sm       // 0.875rem
text-base     // 1rem
text-lg       // 1.125rem
text-xl       // 1.25rem
text-2xl      // 1.5rem
text-3xl      // 1.875rem
text-4xl      // 2.25rem
```

### Pesos
```tsx
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700
```

### Estilos de Texto
```tsx
// Título Principal
text-2xl font-bold text-gray-800 dark:text-gray-100

// Título Secundário
text-xl font-semibold text-gray-800 dark:text-gray-100

// Título de Card
text-lg font-semibold text-blue-600 dark:text-blue-400

// Subtítulo
text-sm font-medium text-gray-600 dark:text-gray-300

// Corpo do texto
text-base text-gray-700 dark:text-gray-200

// Texto pequeno/muted
text-sm text-gray-500 dark:text-gray-400

// Texto de erro
text-sm text-red-500

// Texto de sucesso
text-sm text-green-600 dark:text-green-400

// Link
text-blue-600 dark:text-blue-400 hover:underline
```

---

## 📐 Espaçamento Padrão

```tsx
// Gap entre elementos
gap-1   // 0.25rem
gap-2   // 0.5rem
gap-3   // 0.75rem
gap-4   // 1rem
gap-6   // 1.5rem
gap-8   // 2rem

// Padding de cards
p-4     // 1rem
p-6     // 1.5rem
p-8     // 2rem

// Margin entre seções
space-y-4  // 1rem
space-y-6  // 1.5rem
space-y-8  // 2rem

// Label para Input (espaçamento padrão)
mb-1.5 block text-sm font-medium
```

---

## ✅ Checklist de Implementação

Ao criar novos componentes ou páginas, verifique:

- [ ] Títulos usam `text-blue-600 dark:text-blue-400` ou gradiente
- [ ] Textos secundários usam `text-gray-600 dark:text-gray-300`
- [ ] Textos muted usam `text-gray-500 dark:text-gray-400`
- [ ] Botões de ação usam `bg-emerald-500 hover:bg-emerald-600 text-white`
- [ ] Erros usam `text-red-500` ou `text-red-600 dark:text-red-400`
- [ ] Bordas usam `border-gray-200 dark:border-gray-700`
- [ ] Links usam `text-blue-600 dark:text-blue-400`
- [ ] Inputs têm focus azul `focus:border-blue-500`
- [ ] Componentes evitam cores hardcoded sem variante dark

---

## 🔧 Variáveis CSS Disponíveis

As variáveis em `src/index.css` podem ser usadas via `hsl(var(--nome))`:

| Variável | Uso |
|----------|-----|
| `--background` | Fundo da página |
| `--foreground` | Texto principal |
| `--card` | Fundo de cards |
| `--primary` | Cor primária (azul) |
| `--secondary` | Cor secundária |
| `--muted` | Backgrounds sutis |
| `--muted-foreground` | Texto secundário |
| `--accent` | Destaques |
| `--destructive` | Erros/ações destrutivas |
| `--border` | Bordas |
| `--input` | Bordas de inputs |
| `--ring` | Focus ring |

**Nota:** Para cores vibrantes e controle preciso de light/dark, prefira classes Tailwind explícitas como `text-blue-600 dark:text-blue-400` ao invés de variáveis CSS.

---

## 📱 Responsividade

Breakpoints padrão do Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px (sidebar aparece)
- `xl`: 1280px
- `2xl`: 1536px

Padrão de tamanhos de fonte responsivos:
```tsx
className="text-base lg:text-lg xl:text-xl"
className="text-sm lg:text-base xl:text-lg"
```

---

## 🎛️ ThemeToggle

O componente `ThemeToggle` está disponível em `src/components/ui/theme-toggle.tsx`.

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Em páginas públicas (posição fixa)
<div className="fixed top-4 right-4 z-50">
  <ThemeToggle />
</div>

// No header de páginas autenticadas
<ThemeToggle />
```

---

## 📁 Arquivos de Referência

- `src/index.css` - Variáveis CSS e configuração de temas
- `src/contexts/ThemeContext.tsx` - Contexto e hook useTheme
- `src/components/ui/theme-toggle.tsx` - Componente de toggle
- `src/components/ui/input.tsx` - Input com estados de erro
- `src/components/ui/button.tsx` - Variantes de botões
- `src/components/ui/alert.tsx` - Alerts com variante destructive
- `src/components/SystemInfoSidebar.tsx` - Exemplo de sidebar com features
