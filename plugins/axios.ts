import https from 'https';
import {NuxtAxiosInstance} from "@nuxtjs/axios";

export default function ({ $axios }: { $axios: NuxtAxiosInstance }) {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
}
