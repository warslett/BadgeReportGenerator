<template>
  <div>
    <div class="min-height-300 bg-primary bg-print-transparent position-absolute w-100"></div>
    <main class="main-content position-relative border-radius-lg ">
      <Nuxt />
    </main>
  </div>
</template>

<style>
body{
  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
}

@media print {
  .page {
    page-break-after: always;
  }

  .col-print-12 {
    flex: 0 0 auto;
    width: 100%;
  }

  .no-print, .no-print * {
    display: none !important;
  }

  .bg-print-transparent {
    background-color: transparent !important;
  }

  .text-print-default {
    color: var(--bs-heading-color) !important;
  }

  .breadcrumb-item.text-print-default::before {
    color: var(--bs-heading-color) !important;
  }

  .py-print-0 {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .mt-print-0 {
    margin-top: 0 !important;
  }
}
</style>
